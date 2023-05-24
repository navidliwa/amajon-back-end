const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) {
      res.status(404).json({ message: `Can't find that product!` });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);

    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // if no product tags, just respond
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


// update product
router.put('/:id', async (req, res) => {
  // // update product data
  // Product.update(req.body, {
  //   where: {
  //     id: req.params.id,
  //   },
  // })
  //   .then((product) => {
  //     // find all associated tags from ProductTag
  //     return ProductTag.findAll({ where: { product_id: req.params.id } });
  //   })
  //   .then((productTags) => {
  //     // get list of current tag_ids
  //     const productTagIds = productTags.map(({ tag_id }) => tag_id);
  //     // create filtered list of new tag_ids
  //     const newProductTags = req.body.tagIds
  //       .filter((tag_id) => !productTagIds.includes(tag_id))
  //       .map((tag_id) => {
  //         return {
  //           product_id: req.params.id,
  //           tag_id,
  //         };
  //       });
  //     // figure out which ones to remove
  //     const productTagsToRemove = productTags
  //       .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
  //       .map(({ id }) => id);

  //     // run both actions
  //     return Promise.all([
  //       ProductTag.destroy({ where: { id: productTagsToRemove } }),
  //       ProductTag.bulkCreate(newProductTags),
  //     ]);
  //   })
  //   .then((updatedProductTags) => res.json(updatedProductTags))
  //   .catch((err) => {
  //     // console.log(err);
  //     res.status(400).json(err);
  //   });
  try {
    const [affectedRows] = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (affectedRows === 0) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    if (req.body.tagIds && req.body.tagIds.length) {
      const existingTags = await ProductTag.findAll({
        where: {
          product_id: req.params.id,
        },
      });

      const existingTagIds = existingTags.map(({ tag_id }) => tag_id);
      const newTagIds = req.body.tagIds.filter(
        (tag_id) => !existingTagIds.includes(tag_id)
      );

      const productTagsToRemove = existingTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(
          newTagIds.map((tag_id) => ({
            product_id: req.params.id,
            tag_id,
          }))
        ),
      ]);
    }

    res.status(200).json({ message: 'Product updated successfully!' });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const product = await Product.destroy({ where: { id: req.params.id }});

    if (!product) {
      res.status(404).json({ message: `Can't find that product!`});
      return;
    }
    
    res.status(200).json(product);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
