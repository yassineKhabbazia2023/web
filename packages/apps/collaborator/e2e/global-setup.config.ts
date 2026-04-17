import { createGlobalSetup } from '@pulse/e2e-mocks/helpers'

export default createGlobalSetup('http://localhost:1338/collaborateur/', [
  'portefeuille/dossiers',
  'portefeuille/administration-dossiers',
])
