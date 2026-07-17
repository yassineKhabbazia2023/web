// Shared constructor spy for the '@microsoft/signalr' HubConnectionBuilder,
// referenced by the signalr hub factory (doctrine: shared-hubs): the SDK never
// builds a real connection in unit tests. The own-specs of the hub connection
// helpers arm the builder chain per test (mockImplementation with a `function`
// body — the spy is called with `new`, which forbids mockReturnValue):
//   HubConnectionBuilderMock.mockImplementation(function() { return localBuilderMock })
export const HubConnectionBuilderMock = vi.fn()
