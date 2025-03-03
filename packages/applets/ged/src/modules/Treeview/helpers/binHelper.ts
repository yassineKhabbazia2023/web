import type { Service } from '@ged/models/Service'

// There's no specific endpoint to retrieve bin as it's based on services
// That's why we need to format all the current services to match the Tree structure
export const formatBinData = (entityServices: Service[]) => {
  const formattedServices = entityServices.map((service) => ({
    id: service.ServiceId,
    name: service.ServiceName,
    iconName: 'binIcon',
  }))

  // Returns a "parent" tree folder with all the services bins inside as children
  // so it is usable by the tree
  return [
    {
      id: 'bin',
      name: 'Corbeille',
      iconName: 'binIcon',
      isRootFolder: true,
      children: formattedServices,
    },
  ]
}
