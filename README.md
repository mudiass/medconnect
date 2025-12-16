Primeiro, execute o servidor de desenvolvimento:

npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
Abra http://localhost:3000 no seu navegador para ver o resultado.

Você pode começar a editar a página modificando app/page.tsx. A página atualiza automaticamente conforme você edita o arquivo.

Este projeto usa next/font para otimizar e carregar automaticamente Geist, uma nova família de fontes da Vercel.

Saiba Mais
Para aprender mais sobre Next.js, confira os seguintes recursos:

Documentação do Next.js - conheça os recursos e a API do Next.js.
Aprenda Next.js - um tutorial interativo de Next.js.
Você também pode visitar o repositório do Next.js no GitHub - seu feedback e contribuições são bem-vindos!

Executando um servidor de sinalização local (para chamadas de vídeo reais)
Este projeto inclui um servidor mínimo de sinalização WebSocket usado pela implementação de demonstração do WebRTC.

Instale o pacote ws se ainda não tiver feito isso: npm install (ele está incluído em devDependencies)
Inicie o servidor de sinalização: npm run signaling (executa scripts/signaling-server.js em ws://localhost:4000)
