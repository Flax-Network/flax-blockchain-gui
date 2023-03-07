import { createApi } from '@reduxjs/toolkit/query/react';

import flaxLazyBaseQuery from './flaxLazyBaseQuery';

export const baseQuery = flaxLazyBaseQuery({});

export default createApi({
  reducerPath: 'flaxApi',
  baseQuery,
  endpoints: () => ({}),
});
