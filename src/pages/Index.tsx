// Update this page (the content is just a fallback if you fail to update the page)

import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Bem-vinda ao app do E-book</h1>
        <p className="text-xl text-gray-600">Agora com extrator de PDF para comparar receitas.</p>
        <div className="flex items-center justify-center gap-2">
          <Link to="/extractor">
            <Button>Ir para o Extrator</Button>
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;