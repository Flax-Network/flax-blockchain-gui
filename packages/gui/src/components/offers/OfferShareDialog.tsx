import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

import { OfferTradeRecord } from '@flax-network/api';
import {
  ButtonLoading,
  CopyToClipboard,
  DialogActions,
  Flex,
  TooltipIcon,
  useOpenDialog,
  useShowError,
  useOpenExternal,
} from '@flax-network/core';
import { Trans, t } from '@lingui/macro';
import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  FormControlLabel,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import debug from 'debug';
import React, { useCallback, useEffect, useMemo } from 'react';

import useAssetIdName, { AssetIdMapEntry } from '../../hooks/useAssetIdName';
import useSuppressShareOnCreate from '../../hooks/useSuppressShareOnCreate';
import { launcherIdToNFTId } from '../../util/nfts';
import NotificationSendDialog from '../notification/NotificationSendDialog';
import { NFTOfferSummary } from './NFTOfferViewer';
import OfferAsset from './OfferAsset';
import OfferSummary from './OfferSummary';
import {
  offerAssetIdForAssetType,
  offerContainsAssetOfType,
  shortSummaryForOffer,
  suggestedFilenameForOffer,
} from './utils';

const log = debug('flax-gui:offers');

/* ========================================================================== */

enum OfferSharingService {
}

enum OfferSharingCapability {
  Token = 'Token',
  NFT = 'NFT',
}

interface OfferSharingProvider {
  service: OfferSharingService;
  name: string;
  capabilities: OfferSharingCapability[];
}

type CommonOfferProps = {
  offerRecord: OfferTradeRecord;
  // eslint-disable-next-line react/no-unused-prop-types -- False positive
  offerData: string;
  // eslint-disable-next-line react/no-unused-prop-types -- False positive
  testnet?: boolean;
};

type CommonDialogProps = {
  open?: boolean;
  onClose?: (value: boolean) => void;
};

type CommonShareServiceDialogProps = CommonDialogProps & {
  // eslint-disable-next-line react/no-unused-prop-types -- False positive
  isNFTOffer?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types -- False positive
  showSendOfferNotificationDialog?: (show: boolean, offerURL: string) => void;
};

type OfferShareServiceDialogProps = CommonOfferProps & CommonShareServiceDialogProps;

const testnetDummyHost = 'offers-api-sim.flaxnetwork.org';

const OfferSharingProviders: {
  [key in OfferSharingService]: OfferSharingProvider;
} = {
};

/* ========================================================================== */

async function writeTempOfferFile(offerData: string, filename: string): Promise<string> {
  const { ipcRenderer } = window as any;
  const tempRoot = await ipcRenderer?.invoke('getTempDir');
  const tempPath = fs.mkdtempSync(path.join(tempRoot, 'offer'));
  const filePath = path.join(tempPath, filename);

  fs.writeFileSync(filePath, offerData);

  return filePath;
}

/* ========================================================================== */

type OfferShareConfirmationDialogProps = CommonOfferProps &
  CommonDialogProps & {
    title: React.ReactElement;
    onConfirm: () => Promise<void>;
    actions?: React.ReactElement;
  };

function OfferShareConfirmationDialog(props: OfferShareConfirmationDialogProps) {
  const { offerRecord, title, onConfirm, actions = null, onClose = () => {}, open = false } = props;
  const showError = useShowError();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isNFTOffer = offerContainsAssetOfType(offerRecord.summary, 'singleton');
  const OfferSummaryComponent = isNFTOffer ? NFTOfferSummary : OfferSummary;

  function handleClose() {
    onClose(false);
  }

  async function handleConfirm() {
    try {
      setIsSubmitting(true);

      await onConfirm();
    } catch (e) {
      showError(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      open={open}
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>
        <Flex flexDirection="column" gap={1} style={{ paddingTop: '1em' }}>
          <OfferSummaryComponent
            isMyOffer
            imported={false}
            summary={offerRecord.summary}
            makerTitle={
              <Typography variant="subtitle1">
                <Trans>Assets I am offering:</Trans>
              </Typography>
            }
            takerTitle={
              <Typography variant="subtitle1">
                <Trans>Assets I will receive:</Trans>
              </Typography>
            }
            rowIndentation={3}
            showNFTPreview
          />
        </Flex>
      </DialogContent>
      <DialogActions>
        {actions}
        <Flex flexGrow={1} />
        <Button onClick={handleClose} color="primary" variant="contained" disabled={isSubmitting}>
          <Trans>Cancel</Trans>
        </Button>
        <ButtonLoading onClick={handleConfirm} variant="outlined" loading={isSubmitting}>
          <Trans>Share</Trans>
        </ButtonLoading>
      </DialogActions>
    </Dialog>
  );
}

/* ========================================================================== */

type OfferShareDialogProps = CommonOfferProps &
  CommonDialogProps & {
    showSuppressionCheckbox?: boolean;
    exportOffer?: () => void;
    address?: string;
  };

interface OfferShareDialogProvider extends OfferSharingProvider {
  dialogComponent: React.FunctionComponent<OfferShareServiceDialogProps>;
  dialogProps: Record<string, unknown>;
}

export default function OfferShareDialog(props: OfferShareDialogProps) {
  const {
    offerRecord,
    offerData,
    exportOffer,
    open = false,
    onClose = () => {},
    showSuppressionCheckbox = false,
    testnet = false,
    address,
  } = props;
  const openDialog = useOpenDialog();
  const [sendOfferNotificationOpen, setSendOfferNotificationOpen] = React.useState(false);
  const [offerURL, setOfferURL] = React.useState('');
  const [suppressShareOnCreate, setSuppressShareOnCreate] = useSuppressShareOnCreate();
  const isNFTOffer = offerContainsAssetOfType(offerRecord.summary, 'singleton', 'requested');
  const nftLauncherId = isNFTOffer
    ? offerAssetIdForAssetType(OfferAsset.NFT, offerRecord.summary, 'requested')
    : undefined;
  const nftId = nftLauncherId ? launcherIdToNFTId(nftLauncherId) : undefined;

  const showSendOfferNotificationDialog = useCallback(
    (localOpen: boolean, localOfferURL: string) => {
      setOfferURL(localOfferURL);
      setSendOfferNotificationOpen(localOpen);
    },
    [setOfferURL, setSendOfferNotificationOpen]
  );

  const shareOptions: OfferShareDialogProvider[] = useMemo(() => {
    const capabilities = isNFTOffer ? [OfferSharingCapability.NFT] : [OfferSharingCapability.Token];
    const commonDialogProps: CommonShareServiceDialogProps = {
      showSendOfferNotificationDialog,
      isNFTOffer,
    };

    const dialogComponents: {
      [key in OfferSharingService]?: {
        component: React.FunctionComponent<OfferShareServiceDialogProps>;
        props: CommonShareServiceDialogProps;
      };
    } = {
    };

    const options = Object.keys(OfferSharingService)
      .filter((key) => Object.keys(dialogComponents).includes(key))
      .filter((key) =>
        OfferSharingProviders[key as OfferSharingService].capabilities.some((cap) => capabilities.includes(cap))
      )
      .map((key) => {
        const { component, props: dialogProps } = dialogComponents[key as OfferSharingService]!;
        return {
          ...OfferSharingProviders[key as OfferSharingService],
          dialogComponent: component,
          dialogProps,
        };
      });

    return options;
  }, [isNFTOffer, testnet, showSendOfferNotificationDialog]);

  useEffect(() => {
    if (sendOfferNotificationOpen && offerURL && nftId) {
      openDialog(<NotificationSendDialog offerURL={offerURL} nftId={nftId} address={address} />);
      setSendOfferNotificationOpen(false);
    }
  }, [openDialog, sendOfferNotificationOpen, offerURL, nftId, address]);

  function handleClose() {
    onClose(false);
  }

  async function handleShare(dialogProvider: OfferShareDialogProvider) {
    const DialogComponent = dialogProvider.dialogComponent;
    const { dialogProps } = dialogProvider;

    await openDialog(
      <DialogComponent offerRecord={offerRecord} offerData={offerData} testnet={testnet} {...dialogProps} />
    );
  }

  function toggleSuppression(value: boolean) {
    setSuppressShareOnCreate(value);
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      open={open}
    >
      <DialogTitle id="alert-dialog-title">
        <Trans>Share Offer</Trans>
      </DialogTitle>

      <DialogContent dividers>
        <Flex flexDirection="column" gap={2} paddingTop={2}>
          <Flex flexDirection="column" gap={2}>
            <Typography variant="subtitle1">Where would you like to share your offer?</Typography>
            <Flex flexDirection="column" gap={3}>
              {shareOptions.map((dialogProvider) => (
                <Button variant="outlined" onClick={() => handleShare(dialogProvider)} key={dialogProvider.name}>
                  {dialogProvider.name}
                </Button>
              ))}
              {exportOffer !== undefined && (
                <Button variant="outlined" color="secondary" onClick={exportOffer}>
                  <Flex flexDirection="column">Save Offer File</Flex>
                </Button>
              )}
            </Flex>
          </Flex>
          {showSuppressionCheckbox && (
            <FormControlLabel
              control={
                <Checkbox
                  name="suppressShareOnCreate"
                  checked={!!suppressShareOnCreate}
                  onChange={(event) => toggleSuppression(event.target.checked)}
                />
              }
              label={<Trans>Do not show this dialog again</Trans>}
            />
          )}
        </Flex>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          <Trans>Close</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
