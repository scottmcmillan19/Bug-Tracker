import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/components/App';

const createNewBugRender = (url) => {
    const initialData = {bugId: null};
    return {
        initialMarkup: ReactDOMServer.renderToString(
          <App url={url} initialData={initialData}/>
        ),
        initialData
      };
}

export default createNewBugRender;