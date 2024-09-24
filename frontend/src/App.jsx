import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import QuestionList from './components/QuestionList.jsx';
import QuestionDetail from './components/QuestionDetail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  console.log('App component rendering');

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <ProtectedRoute exact path="/questions/:id" component={QuestionDetail} />
            <ProtectedRoute exact path="/questions" component={QuestionList} />
            <Redirect exact from="/" to="/questions" />
            <Route path="*" render={() => <div>404 Not Found</div>} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;