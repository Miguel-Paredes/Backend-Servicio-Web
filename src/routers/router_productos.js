import express from 'express'

const routerProductos = express.Router()

routerProductos.use(express.json())

routerProductos.get('/', (req, res) => res.send('Listar productos'))

routerProductos.get('/buscar/:id', (req, res) => res.send('Buscar productos'))

routerProductos.post('/registro', (req, res) => res.send('Registrar productos'))

routerProductos.put('/actualizar/:id', (req, res) => res.send('Actualizar productos'))

routerProductos.delete('/eliminar/:id', (req, res) => res.send('Eliminar productos'))

routerProductos.use((req, res) => res.status(404).end())

export default routerProductos