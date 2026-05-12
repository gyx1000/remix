import { get, route } from 'remix/routes'

export const routes = route({
  home: get('/'),
  frames: route('frames', {
    inventory: get('/inventory'),
  }),
})
