![Image](https://github.com/user-attachments/assets/92f6a0ce-3e03-439a-83b9-6d5b0ecb49a0)
![Image](https://github.com/user-attachments/assets/1aa114b3-e3e4-4e88-b20c-7358a602f850)
![Image](https://github.com/user-attachments/assets/8d2a2c88-1596-4abb-bba3-7ba30a273d35)
![Image](https://github.com/user-attachments/assets/4b333c0f-3c88-4194-b4cb-1e183d67960e)


MedConnect

Este é um projeto Next.js
 inicializado com create-next-app
.

Começando

Primeiro, execute o servidor de desenvolvimento:

npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev


Abra http://localhost:3000
 no seu navegador para ver o resultado.

Você pode começar a editar a página modificando app/page.tsx. A página é atualizada automaticamente conforme você edita o arquivo.

Este projeto utiliza next/font
 para otimizar e carregar automaticamente a fonte Geist
, uma nova família de fontes da Vercel.

Saiba Mais

Para aprender mais sobre o Next.js, confira os seguintes recursos:

Documentação do Next.js
 – aprenda sobre os recursos e a API do Next.js.

Aprenda Next.js
 – um tutorial interativo de Next.js.

Você também pode conferir o repositório do Next.js no GitHub
 — seu feedback e contribuições são bem-vindos!

Executando um servidor de sinalização local (para chamadas de vídeo reais)

Este projeto inclui um servidor mínimo de sinalização WebSocket utilizado pela implementação de demonstração do WebRTC.

Instale o pacote ws caso ainda não tenha instalado: npm install (ele já está incluído em devDependencies)

Inicie o servidor de sinalização: npm run signaling (executa scripts/signaling-server.js em ws://localhost:4000)

Inicie a aplicação: npm run dev

Abra o aplicativo em dois dispositivos ou navegadores, faça login como Médico em um e Paciente no outro (ambos devem usar o mesmo consultationId — o aplicativo utiliza o id da consulta na query para entrar na mesma sala). A chamada de vídeo usará o servidor de sinalização para trocar SDP e ICE, permitindo que cada lado veja a câmera do outro.
