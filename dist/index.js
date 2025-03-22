"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const claseRoutes_1 = __importDefault(require("./routes/claseRoutes"));
const asistenciaRoutes_1 = __importDefault(require("./routes/asistenciaRoutes"));
const claseDiasRoutes_1 = __importDefault(require("./routes/claseDiasRoutes"));
const inscripcionRoutes_1 = __importDefault(require("./routes/inscripcionRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares  
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api", usuarioRoutes_1.default);
app.use("/api", claseRoutes_1.default);
app.use("/api", asistenciaRoutes_1.default);
app.use("/api", claseDiasRoutes_1.default);
app.use("/api", inscripcionRoutes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Ruta de prueba
app.get("/", (req, res, next) => {
    res.send("¡API en funcionamiento!");
});
// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo salió mal");
});
// Puerto del servidor
const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
