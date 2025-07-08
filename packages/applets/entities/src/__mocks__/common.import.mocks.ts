vi.mock('@pulse/common', () => ({
  AmplitudeService: {
    track: vi.fn(),
  },
}))
