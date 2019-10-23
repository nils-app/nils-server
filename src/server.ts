import app from './app';
import { getTransferWiseProfile } from './lib/transferwise';

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log(
    '[%s] App is running at http://localhost:%d',
    app.get('env'),
    app.get('port'),
  )
})

// Preload the transferwise profile id
getTransferWiseProfile();

export default server
