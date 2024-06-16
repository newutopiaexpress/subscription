import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import Spline from '@splinetool/react-spline/next';


const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error();
  }

  return (
    <div className={"grow flex flex-col relative"}>
      <Chat accessToken={accessToken} />
        
          <Spline
            scene="https://prod.spline.design/j8Rw8Mc5WtdEF9IO/scene.splinecode" 
          />
        
    </div>
  );
}
