// APW
// Páginas
// Productos (Detail) - Pruebas
// José Esteva <josesteva@cic.unam.mx>

import { render } from '@testing-library/react';

import Detail from './index';

// Mock useDetail
jest.mock('../../../hooks/form', () => ({
  __esModule: true,
  default: (section, query) => {
    return {
      values: null,
      formLink: {
        disabled: true,
        onChange: jest.fn()
      },
      handleEdit: jest.fn(),
      handleDelete: jest.fn(),
      handleAccept: jest.fn(),
      handleCancel: jest.fn()
    }
  },
}));

test('Productos <Detail/>', () => {
  render(<Detail/>);
});
