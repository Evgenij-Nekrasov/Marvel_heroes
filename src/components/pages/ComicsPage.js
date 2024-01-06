import { Helmet } from "react-helmet";

import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";
import ErrorBoudary from "../errorBoudary/ErrorBoudary";

const ComicsPage = () => {
   return (
      <>
         <Helmet>
            <meta name="description" content="Page with list of our comics" />
            <title>Comics page</title>
         </Helmet>
         <AppBanner />
         <ErrorBoudary>
            <ComicsList />
         </ErrorBoudary>
      </>
   );
};

export default ComicsPage;
