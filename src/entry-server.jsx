import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { store } from './store/index.js'
import App from './App.jsx'

export function render(location) {
  return renderToString(
    <Provider store={store}>
      <StaticRouter basename={import.meta.env.BASE_URL} location={location}>
        <App />
      </StaticRouter>
    </Provider>,
  )
}
