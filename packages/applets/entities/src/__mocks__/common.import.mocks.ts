vi.mock('@pulse/common', () => ({
  amplitudeService: {
    track: vi.fn(),
  },
}))
