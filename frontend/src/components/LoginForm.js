import React from 'react';

function LoginForm() {
    return (
        <section>
          <div className="box">
          <div className="text-center mt-1">
              <form style="max-width:320px;margin:auto;">
                  <h1 className="h1 mb-3"> Gjørno</h1>
                  <h1 className="h6" style="font-weight: normal;">Vennligst logg inn</h1>
                  <label className="sr-only" htmlFor="brukernavn">Brukernavn
                  </label>
                  <input type="text" className="form-control" id="brukernavn" placeholder="Brukernavn" required autoFocus />
                  <label htmlFor="password" className="sr-only">Passord</label>
                  <input type="password" id="password" placeholder="Passord" className="form-control" required />
                  <div className="checkbox mt-3">
                      <label>
                          <input type="checkbox" value="remember-me" text="Husk meg"/>
                      </label>
                  </div>
                  <div className="mt-3"><button className="btn btn-lg btn-primary btn-block">Logg inn</button></div>
              </form>
          </div>
          </div>
      </section>
    );
}

export default LoginForm;