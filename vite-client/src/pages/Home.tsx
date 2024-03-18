import * as React from 'react';
import { Link } from 'react-router-dom';
import Darkmode from 'drkmd-js';


export default function Home() {
    const darkmode = new Darkmode()
    darkmode.toggle()
    darkmode.attach()

    return (
    <div>
      <div className="container text-center landing-hero">
      <h1>
        Demonstrate your experiments with a suitable layout for your audience
      </h1>
      <p style={{ margin: '10px 0' }}>
        Create, customize and share your experiments with an easy-to-use and
        interactive interface
      </p>
      <Link className="button" to="/setup">
        Get started
      </Link>
    </div>
    </div>
    );
}
