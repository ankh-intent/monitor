import { ServerOptions } from './ServerOptions';

export class RoutesCollection<O extends ServerOptions> {
  public configure(app, options: O) {
    // app.get('/', (req, res) => {
    //   res.redirect('/index.html');
    // });
  }
}
