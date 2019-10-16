import app from './app';

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

export default server
