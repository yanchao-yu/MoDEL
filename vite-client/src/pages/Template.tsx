import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import SetupForm from '../components/SetupForm';
import Darkmode from 'drkmd-js'

export default function Template() {
  const darkmode = new Darkmode()
    darkmode.toggle()
    darkmode.attach()


  return (
    <div className="setup-container">
      <Link className="nav-link" to="/">
        &#8592; Back to Home
      </Link>
      <h1 className="title">2. Setup template</h1>
        <SetupForm display_area={false} webcam={false} />
    </div>
  );
}

