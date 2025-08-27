import React, {lazy, Suspense} from 'react'
import {ActionLoader} from "@/components/loader/actionLoader/loader.component";
import {NextPageContext} from "next";
 import { headers } from "next/headers"
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { API, FYERSAPINSECSV } from '@/libs/client';

const CompanyView = lazy(() => import ("@/components/company/companyInfo/CompanyView"));
/* this is server component not possible 
function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  return baseUrl;
}*/


const CompanyPage = ({params}: any) => {
    console.log(params)
     const baseUrl = FYERSAPINSECSV;  // 'http://localhost:3000/'
     const headersList = headers()
     const referer = headersList.get("referer")
     let url = referer?.substring(0,referer?.indexOf('company')-1)
      let  request :any =undefined;
     if (referer) {
       request   = new NextRequest(referer)
         console.log(request.nextUrl.pathname)
     }
    return (
        <Suspense fallback={<ActionLoader/>}>
            <div className={''}>
                { params.slug !=='error' ? <CompanyView _id={params.slug}/>
                 : redirect( request !==undefined && url !==undefined ? url : baseUrl)
                }
                
            </div>
        </Suspense>

    )
}

CompanyPage.getInitialProps = async (ctx: NextPageContext) => {
    console.log("" + JSON.stringify(ctx.query), "ss")
    return {_id: ctx.query.id};
}

export default CompanyPage
