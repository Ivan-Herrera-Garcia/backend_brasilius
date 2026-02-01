import { Router, Context, helpers } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.31.1/mod.ts"; // Importa Bson para usar ObjectId
import { db } from "../db.ts"; // Importar la conexión a MongoDB

const inventarioRouter = new Router();
const registroCollection = db.collection("inventario");
const { getQuery } = helpers;

// Obtener todos los asesores
inventarioRouter.get("/inventario", async (context: Context) => {
  const registros = await registroCollection.find();
  context.response.body = registros;
});

inventarioRouter.get("/inventario/:id", async (context: Context) => {
    const { id } = getQuery(context, { mergeParams: true });
    try {
        var registro = await registroCollection.find({ _id: new Bson.ObjectId(id)});
        const registroId = await registro.toArray();
        if (registroId.length != 0) {
          context.response.body = registroId;
        } else {
            context.response.status = 404;
            context.response.body = { message: "Registro no encontrado" };
        }
    }
    catch (error: any) {
            context.response.status = 500;
            context.response.body = { message: "Error, consultar con el administrador", error: error.message };
    }
});

inventarioRouter.post("/addinventario", async (context: Context) => {
    try {
        const body = await context.request.body();
        const value = await body.value;
        if (!value) {
            context.response.status = 400;
            context.response.body = { message: "Invalid request body" };
            return;
        }
        var { titulo, precios, descripcion, imagen, ingredientes } = value;
        const registro = await registroCollection.insertOne({ titulo, precios, descripcion, imagen, ingredientes});
        context.response.status = 201;
        context.response.body = { message: "Registro creado", registro };

    } catch (error: any) {
        context.response.status = 500;
        context.response.body = { message: "Error, consultar con el administrador", error: error.message };
    }
});

inventarioRouter.post("/editinventario", async (context: Context) => {
    try {
        const body = await context.request.body();
        const value = await body.value;
        if (!value) {
            context.response.status = 400;
            context.response.body = { message: "Invalid request body" };
            return;
        }
        var { _id, titulo, precios, descripcion, imagen, ingredientes } = value;
        const isExist = await registroCollection.findOne({ _id: new Bson.ObjectId(_id) });
        if (!isExist) {
            context.response.status = 400;
            context.response.body = { message: "Registro no existe" };
            return;
        }
        const registro = await registroCollection.updateOne({ _id: new Bson.ObjectId(_id) }, { $set: { titulo, precios, descripcion, imagen, ingredientes } });
        context.response.status = 200;
        context.response.body = { message: "Registro actualizado", registro };

    } catch (error: any) {
        context.response.status = 500;
        context.response.body = { message: "Error, consultar con el administrador", error: error.message };
    }
});

export default inventarioRouter;
