import { Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import inventarioRouter from "./inventario.ts"; "./inventario.ts";

const router = new Router();

router.get("/", (context) => {
  context.response.body = "Bienvenido al BACKEND de Brasilius";
});

// Importa las rutas de asesores
router.use(inventarioRouter.routes());
router.use(inventarioRouter.allowedMethods());

export default router;
