import { defineConfig } from "orval";
const API_NAME = 'itc-summer';
const API_URL = 'http://localhost:3000/api-yaml'; // URL directa a tu API

export default defineConfig ({
  [API_NAME]: {
    output: {
      mode: 'tags-split',
      target: 'src/generated/api',
      schemas: 'src/generated/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: 'src/api/http/axios.mutator.ts',
        },
      },
    },
    input: {
      target: API_URL,
      validation: false,
    },
  },
});