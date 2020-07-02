const { Model } = require('../models/model');
const productModel = new Model('products');

module.exports = {
    favorite: async (req, res) => {
        const currentUser = req.session.userId;
        try {
            const data = await productModel.select(
                '*',
                ` JOIN favorites on product_id = products.id
                          where favorites.user_id = ${currentUser} AND products.active = true AND favorites.active = true;`
            );
            console.log(data.rows);
            res.status(200).json({ data: data.rows });
        } catch (err) {
            res.status(200).json({ error: err.stack });
        }
    },

    filter: async (req, res) => {
        let price = req.params.price;
        try {
            const data = await productModel.select(
                '*',
                ` WHERE price < ${price} AND active = true`
            );
            res.status(200).json({ data: data.rows });
        } catch (err) {
            res.status(200).json({ error: err.stack });
        }
    },

    // Display list of all ProductInstances.
    index: async (req, res) => {
        let idQuery;
        if (req.params.id) {
            idQuery = ` WHERE id = ${req.params.id}`;
        }
        try {
            // const data = await productModel.select('*', ` WHERE active = true`);
            const data = await productModel.select('*', idQuery);

            res.status(200).json({ data: data.rows, currentUser: req.session.userId });
        } catch (err) {
            res.status(200).json({ error: err.stack });
        }
    },

    // Display detail page for a specific ProductInstance.
    show: async (req, res) => {
        try {
            const data = await productModel.select(
                '*',
                ` WHERE id = ${req.params.id}`
            );
            // passed in cookie session user_id
            const userId = req.session.userId;
            // console.log({...data.rows[0]});
            res.render('products_show', { ...data.rows[0], userId });
        } catch (err) {
            res.status(200).json({ error: err.stack });
        }
    },

    // Display ProductInstance create form on GET.
    create: (req, res) => {
        res.render('products_new');
    },

    // Handle ProductInstance create on POST.
    store: async (req, res) => {
        const {
            title,
            description,
            price,
            location,
            user_id,
            cover_photo_url,
            product_photo_url,
        } = req.body;

        const columns =
            'title, description, price, location, user_id, cover_photo_url, product_photo_url';
        const values = [
            title,
            description,
            price,
            location,
            req.session.userId,
            cover_photo_url,
            product_photo_url,
        ];

        try {
            await productModel.insert(columns, values, res);
            res.redirect('/products');
        } catch (err) {
            res.status(200).json({ error: err.stack });
        }
    },

    // Handle ProductInstance delete on POST.
    destroy: (req, res) => {
        res.send('NOT IMPLEMENTED: ProductInstance delete POST');
    },

    // Handle ProductInstance update on POST.
    update: async (req, res) => {
        try {
            const data = await productModel.update(
                'active',
                false,
                `WHERE products.id = ${req.params.id}`
            );
            res.status(200);
        } catch (err) {
            res.status(200).json({ error: err.stack });
        }
    },
    featured: async (req, res) => {
        try {
            const data = await productModel.select(`*`, ` WHERE featured = true AND active = true`);
            // const data = await productModel.select(`*`, ` WHERE id = 1`);
            res.status(200).json({ data: data.rows });
        } catch (err) {
            res.status(200).json({ error: err.stack });
        }
    },
};

// const addProduct = async (req, res) => {

// module.exports = addProduct;
// module.exports = productPage;
