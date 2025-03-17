const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Ruta para obtener todos los clientes
app.get('/clientes', async (req, res) => {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
});

// Ruta para agregar un nuevo cliente
app.post('/clientes', async (req, res) => {
    const { nombre, apellido, telefono, correo, ruc, direccion } = req.body;
    try {
        const nuevoCliente = await prisma.cliente.create({
            data: { nombre, apellido, telefono, correo, ruc, direccion }
        });
        res.json(nuevoCliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear cliente' });
    }
});

// Ruta para obtener todos los turnos
app.get('/turnos', async (req, res) => {
    const turnos = await prisma.turno.findMany({ include: { cliente: true } });
    res.json(turnos);
});

// Ruta para agendar un turno
app.post('/turnos', async (req, res) => {
    const { clienteId, fecha, hora, limpiadora } = req.body;
    try {
        const nuevoTurno = await prisma.turno.create({
            data: { clienteId, fecha, hora, limpiadora }
        });
        res.json(nuevoTurno);
    } catch (error) {
        res.status(500).json({ error: 'Error al agendar turno' });
    }
});

// Ruta para actualizar estado de un turno
app.put('/turnos/:id', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        const turnoActualizado = await prisma.turno.update({
            where: { id: parseInt(id) },
            data: { estado }
        });
        res.json(turnoActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar turno' });
    }
});

// Ruta para eliminar un turno
app.delete('/turnos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.turno.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Turno eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar turno' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
