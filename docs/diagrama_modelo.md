erDiagram
CLIENTES ||--o{ TRANSACCIONES : "realiza (referencia \_id)"
PRODUCTOS ||--o{ TRANSACCIONES : "contiene (referencia \_id en items)"

    CLIENTES {
        ObjectId _id
        String nombre
        String email
        Date fecha_registro
        String region
    }

    PRODUCTOS {
        ObjectId _id
        String sku
        String categoria
        String nombre
        Int32 precio_centavos
        Boolean en_oferta
        Object detalles_especificos "Flexible (Talla, Resolución, etc.)"
        Int32 stock_disponible
    }

    TRANSACCIONES {
        ObjectId _id
        ObjectId cliente_id "Ref -> Clientes"
        Date fecha_transaccion
        Int32 total_centavos
        Array items " [{producto_id, cantidad, precio}] "
    }
