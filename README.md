This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



Lector de dni:
Zebra DS8178	Bluetooth (base USB)	Tope de gama de Zebra, rapidísimo y preciso incluso en códigos dañados.	Más caro, pero es el que usan en aeropuertos y bancos.

3️⃣ Cómo funciona un lector Bluetooth en tu caso
Si compras un modelo Bluetooth:

Se empareja con la notebook o tablet de la persona de control (como si fuera un teclado Bluetooth).

Escaneás el DNI → el código PDF417 se envía como texto al equipo.

En tu Next.js solo necesitás tener un input enfocado para capturarlo.

Incluso podés esconder el input y capturar las teclas globalmente.

4️⃣ Diferencia entre modelos baratos y de alta gamas
Los baratos (USD 60–100) leen PDF417, pero suelen fallar con reflejos, mala luz o desgaste del DNI.

Los profesionales (USD 250–600) leen mucho más rápido, toleran daños en el código y permiten distancia de lectura más cómoda (sin tener que pegarlo al lente).

En un entorno empresarial donde cada segundo cuenta, vale la pena ir por uno profesional.

Yo creo que para tu caso, el Zebra DS8178 es de lo mejor:

Es inalámbrico, rápido, soporta PDF417, tiene base para recargar, y funciona a varios metros de la PC.

Si lo usás en modo HID, no tenés que cambiar tu backend: lo que leés aparece igual que si te lo escribieran.