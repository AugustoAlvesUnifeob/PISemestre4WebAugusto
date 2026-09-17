

import ReactDOM from 'react-dom/client'
import AgendaWidget from './AgendaWidget' 


const container = document.getElementById('agenda-root')

if (container) {
  ReactDOM.createRoot(container).render(<AgendaWidget />)
}