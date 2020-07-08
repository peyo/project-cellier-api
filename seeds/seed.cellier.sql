BEGIN;

INSERT INTO users (username, nickname, password)
VALUES
  ('petertest@gmail.com', 'peter', '@ABCabc123'),
  ('miketest@gmail.com', 'mike', '@ABCabc123'), 
  ('justintest@gmail.com', 'justin', '@ABCabc123'), 
  ('christest@gmail.com', 'chris', '@ABCabc123'), 
  ('derektest@gmail.com', 'derek', '@ABCabc123');

INSERT INTO groups (group_name, subgroup_name, description, triangle_a, triangle_b, linear_a, linear_b)
VALUES
  ('Floral', 'Floral', 'Freshly picked flowers.', 'Oriental', 'Aromatic', 'Woody', 'Mossy Woods'),
  ('Floral', 'Soft Floral', 'Aldehydes and powdery notes.', 'Woody', 'Citrus', 'Mossy Woods', 'Aromatic'),
  ('Floral', 'Floral Oriental', 'Orange blossom and sweet spices.', 'Mossy Woods', 'Fruity', 'Aromatic', 'Citrus'),
  ('Oriental', 'Soft Oriental', 'Incense and amber.', 'Aromatic', 'Green', 'Citrus', 'Fruity'),
  ('Oriental', 'Oriental', 'Oriental resins.', 'Citrus', 'Floral',	'Fruity',	'Green'),
  ('Woody', 'Woody', 'Aromatic woods and vetiver.', 'Fruity',	'Floral',	'Green',	'Floral'),
  ('Woody', 'Mossy Woods', 'Oakmoss and amber.', 'Green',	'Floral Oriental',	'Floral',	'Soft Floral'),
  ('Woody', 'Aromatic',	'Intensive grass-spicy.', 'Floral',	'Soft Oriental',	'Soft Floral',	'Floral Oriental'),
  ('Fresh', 'Citrus', 'Bergamot and other citrus oils.',	'Soft Floral',	'Oriental',	'Floral Oriental',	'Soft Oriental'),
  ('Fresh', 'Fruity',	'Berries and non-citrus fruits.', 'Floral Oriental',	'Woody',	'Soft Oriental',	'Woody'),
  ('Fresh', 'Green',	'Herbs and fougeres.', 'Soft Oriental',	'Mossy Woods',	'Oriental', 'Woody');

INSERT INTO scents (scent_name, groups_id, note, distributor, manufacturer, type, origin_country, extra_origin_information, odor_description, link)
VALUES
  ('Lilac', 1, null, 'Camden-Grey', null, 'Fragrance Oil', null, null, 'Sweet, clean, with layers of jasmine and rose.', 'https://www.camdengrey.com/essential-oils/lilac.html'),
  ('Lilac', 1, null, 'Lebermuth', null, 'Fragrance Oil', null, null, 'A classic lilac fragrance with nuances of rose and jasmine.', 'https://shop.lebermuth.com/products/oil-lilac?_pos=2&_sid=dfeb439da&_ss=r'),
  ('Lilac', 1, null, 'Pell Wall', null, 'Fragrance Oil', null, null, 'Floral-lilac, fresh, sweet, paeony, narcissus, earthy.', 'https://pellwall.com/shop/ingredients-for-perfumery/liquids/lilac-pentanol/'),
  ('Lilac', 1, null, 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Heart Notes: Vanilla, Conifer, Rose, Muguet, Spice, Linalool, Jasmine, Aliphatic, Narcotic, Animal, Phenol
  Top Notes: Light, Green, Aliphatic, Citrus
  Bottom Notes: Jasmine, Aliphatic, Spice, Muguet, Green, Animal, Narcotic, Citrus, Herb, Linalool, Fruit, Earthy, Vanilla, Wood', 'https://www.perfumersworld.com/view.php?pro_id=6GK09255'),
  ('Rose', 1, 'Rose Otto', 'Pell Wall', null, 'Essential Oil', 'Iran', null, 'A true velvet rose scent.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/persian-rose-otto/'),
  ('Rose', 1, null, 'Lebermuth', null, 'Absolute Oil', 'Morocco', null, 'A true velvet rose scent.', 'https://shop.lebermuth.com/products/rose-absolute-moroccan?_pos=2&_sid=301ad4ae4&_ss=r'),
  ('Rose', 1, 'Rose Otto', 'Camden-Grey', null, 'Essential Oil', 'Turkey', null, 'Deep, sweet, rosy-floral and tenacious.', 'https://www.camdengrey.com/essential-oils/rose-otto.html'),
  ('Tuberose', 1, null, 'Camden-Grey', null, 'Wax', 'India', null, 'Sweet, honeyed, like beeswax.', 'https://www.camdengrey.com/essential-oils/tuberose.html'),
  ('Tuberose', 1, null, 'Lebermuth', null, 'Essential Oil', null, null, 'The tuberose is traditionally a night blooming plant famous in Hawaii to create long-lasting leis. Complex, sweet, exotic and elegantly floral.', 'https://shop.lebermuth.com/products/oil-tuberose?_pos=1&_sid=975e0c6ad&_ss=r'),
  ('Tuberose', 1, null, 'Pell Wall', 'Firmenich', 'Absolute ', null, null, 'Tuberose.', 'https://pellwall.com/shop/ingredients-for-perfumery/liquids/tubereuse-184108/'),
  ('Tuberose', 1, null, 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Heart Notes: Spice, Zolvent, Narcotic, Balsam, Linalool, Jasmine, Wood, Orchid, Muguet, Vanilla, Rose, Aliphatic, Phenol.
  Top Notes: Soft, Dairy, Fruit, Green.
  Bottom Notes: Dairy, Zolvent, Balsam, Linalool, Wood, Vanilla, Aliphatic, Fruit, Spice, Jasmine, Orchid, Edible.', 'https://www.perfumersworld.com/view.php?pro_id=6ND09418'),
  ('Rose', 1, null, 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Top Notes: Soft, Green, Citrus, Fruit.
  Heart Notes: Rose, Linalool, Wood, Phenol, Jasmine, Narcotic, Iris, Muguet.
  Bottom Notes: Rose, Green, Linalool, Wood, Iris, Muguet, Phenol, Fruit, Narcotic, Spice, Jasmine, Musk.', 'https://www.perfumersworld.com/view.php?pro_id=6RM07757'),
  ('Gardenia', 2, null, 'Camden-Grey', null, 'Fragrance Oil', null, null, 'Fairly strong and luscious. A nice scent that blends well with other florals.', 'https://www.camdengrey.com/essential-oils/gardenia.html'),
  ('Gardenia', 2, null, 'Lebermuth', null, 'Fragrance Oil', null, null, 'A beautiful gardenia fragrance. Top notes of muguet, jasmine, strawberry and grape. Heart notes of gardenia, lilac, rose, hyacinth and narcissus. Base notes of balsam, amber musk, woods and violet.', 'https://shop.lebermuth.com/products/oil-gardenia?_pos=1&_sid=f6732466f&_ss=r'),
  ('Gardenia', 2, null, 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Heart Notes: Jasmine, Aliphatic, Narcotic, Linalool, Spice, Muguet, Vanilla, Animal, Wood, Rose, Zolvent, Balsam, Orchid
  Top Notes: Light, Green, Fruit, Aliphatic, Dairy, Citrus
  Bottom Notes: Jasmine, Aliphatic, Green, Citrus, Herb, Narcotic, Linalool, Spice, Dairy, Muguet, Vanilla, Wood, Fruit, Musk', 'https://www.perfumersworld.com/view.php?pro_id=6ND09094'),
  ('Hyacinth', 2, 'Heather', 'Lebermuth', null, 'Fragrance Oil', null, null, 'A rustic creation of fruits and floral. Top notes of muguet, ozone, jasmine, banana, lemon and grape. Mid notes of lilac, hyacinth, heather, gardenia, rose, carnation, eucalyptus and fir needle. Spearmint, violet and musk base notes.', 'https://shop.lebermuth.com/products/oil-heather-hyacinth?_pos=1&_sid=0fe276fab&_ss=r'),
  ('Hyacinth', 2, 'Body #3', 'Pell Wall', 'International Flavors & Fragrances', 'Fragrance Oil', null, null, 'Green-leafy, floral-hyacinth, balsamic, tobacco, and lilac.', 'https://pellwall.com/shop/ingredients-for-perfumery/liquids/hyacinth-body-3/'),
  ('Hyacinth', 2, null, 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Green-top notes, natural-transparent-florals.', 'https://www.perfumersworld.com/view.php?pro_id=4GN00231'),
  ('Jasmine', 2, null, 'Camden-Grey', null, 'Absolute', 'Egypt', null, 'jasmine-floral, sweet, and indolic. Diffusive and strong.', 'https://www.camdengrey.com/essential-oils/jasmine-absolute.html'),
  ('Jasmine', 2, null, 'Lebermuth', null, 'Fragrance Oil', null, null, 'A classic jasmine. Top notes of muguet, ozone, floral apple with a touch of grape. Heart notes of jasmine, rose, and lilac. Musk and woody notes at the base.', 'https://shop.lebermuth.com/products/oil-jasmine?_pos=1&_sid=6766b0288&_ss=r'),
  ('Jasmine', 2, 'Natural Recreation', 'Pell Wall', 'Payan Bertrand', 'Absolute', null, null, 'jasmine-floral, sweet, indolic. Diffusive and powerful.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/absolutes/jasmine-absolute-natural-recreation/'),
  ('Jasmine', 2, 'Fleuressence', 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Top Notes: Jasmine, Fruit, Narcotic, Linalool, Zolvent, Rose, Green, Orchid, Citrus, Herb, Spice.
  Heart Notes: Jasmine, Fruit, Narcotic, Zolvent, Muguet, Animal, Orchid, Rose, Wood, Green, Balsam, Citrus, Herb, Spice.
  Bottom Notes: Zolvent, Balsam, Linalool, Narcotic, Citrus, Muguet, Aliphatic.', 'https://www.perfumersworld.com/view.php?pro_id=6JN08956'),
  ('Cardamom', 3, null, 'Camden-Grey', null, 'Essential Oil', 'Guatemala', null, 'Spicy, fruity, warm and balsamic.', 'https://www.camdengrey.com/essential-oils/cardamom.html'),
  ('Cardamom', 3, null, 'Pell Wall', null, 'Essential Oil', null, null, 'Warm, spicy, camphoraceous floral, woody, citrus, and balsamic.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/cardamom-oil-albert-vieille/'),
  ('Cardamom', 3, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Fresh, terpene, sweet, spicy, and peppery.', 'https://www.perfumersworld.com/view.php?pro_id=7SC00084'),
  ('Cardamom', 3, 'Organic', 'Lebermuth', null, 'Essential Oil', 'Sri Lanka', null, 'Sweet-spicy, warm with a woody-balsamic undertone.', 'https://shop.lebermuth.com/products/cardamom-organic-oil?_pos=1&_sid=01cbece7f&_ss=r'),
  ('Fennel', 3, 'Sweet', 'Lebermuth', null, 'Essential Oil', 'Hungary', null, 'A very distinct, sweet, green-herbal odor.', 'https://shop.lebermuth.com/products/fennel-sweet-oil?_pos=1&_sid=6b384d321&_ss=r'),
  ('Fennel', 3, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Sweet, aromatic, anise, cooling, warm, herbaceous, peppery, and earthy.', 'https://www.perfumersworld.com/view.php?pro_id=7SB00189'),
  ('Fennel', 3, 'Sweet', 'Camden-Grey', null, 'Essential Oil', 'USA', null, 'Distinct, sweet, and green-herbal odor.', 'https://www.camdengrey.com/essential-oils/fennel-sweet.html'),
  ('Orange Flower', 3, null, 'Pell Wall', null, 'Absolute', 'Morocco', null, 'Sweet, orange blossom stem, fresh, fruity-citrus, sweet-floral, and aromatic.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/absolutes/orange-flower-absolute/'),
  ('Orange Flower', 3, null, 'PerfumersWorld', null, 'Absolute', 'Morocco', null, 'Floral, green, balsamic-honey, and amber.', 'https://www.perfumersworld.com/view.php?pro_id=8NC00338'),
  ('Amber', 4, null, 'PerfumersWorld', null, 'Solid', null, null, 'Sweet, intense, diffusive, warm, animalic, Amber base.', 'https://www.perfumersworld.com/view.php?pro_id=6VU09627'),
  ('Black Amber', 4, null, 'Lebermuth', null, 'Fragrance Oil', null, null, 'Radiant sandalwood, golden amber and the warmth of musk underline crisp apple and ripe blackberry. Silky peach, mellow rose, and sheer jasmine complete Black Amber.', 'https://shop.lebermuth.com/products/oil-black-amber?_pos=1&_sid=74814764c&_ss=r'),
  ('Cinnamon Bark', 4, 'Wildcrafted', 'Camden-Grey', null, 'Essential Oil', 'Madagascar', null, 'Cinnamon sweet, spicy, and floral. ', 'https://www.camdengrey.com/essential-oils/cinnamon-bark-M.html'),
  ('Cinnamon Bark', 4, 'Oliffac', 'Pell Wall', 'International Flavors & Fragrances', 'Fragrance Oil', null, null, 'Cinnamon sweet, spicy, and floral. ', 'https://pellwall.com/shop/ingredients-for-perfumery/liquids/cinnamon-bark-oliffac/'),
  ('Cinnamon Bark', 4, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Sweet, cinnamic, spicy, warm, woody, aromatic, harsh, balsam, warm-spicy.', 'https://www.perfumersworld.com/view.php?pro_id=7SV00107'),
  ('Cinnamon Bark', 4, null, 'Lebermuth', null, 'Essential Oil', 'Sri Lanka', null, 'Cinnamon sweet, spicy and floral.', 'https://shop.lebermuth.com/products/cinnamon-bark-oil?_pos=3&_sid=26732d085&_ss=r'),
  ('Pink Pepper', 4, null, 'Pell Wall', 'Albert Vieille', 'Essential Oil', null, null, 'Fresh, spicy-pepper, lemony, sweet, and balsamic.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/pink-pepper-eo/'),
  ('Birch Tar', 5, null, 'Pell Wall', 'Payan Bertrand', 'Rectified Oil', null, null, 'Smoky, phenolic, leathery, sweet.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/birch-tar-rectified/'),
  ('Birch Tar', 5, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Powerful, burnt wood.', 'https://www.perfumersworld.com/view.php?pro_id=7TP00822'),
  ('Cade', 5, null, 'Pell Wall', null, 'Rectified Oil', null, null, 'Smoky, phenolic, bonfire.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/cade-oil-rectified/'),
  ('Cade', 5, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Birch tar, smoke, burnt, woody, leather, leather-like.', 'https://www.perfumersworld.com/view.php?pro_id=7TW00076'),
  ('Labdanum', 5, 'Undiluted', 'Pell Wall', null, 'Absolute', null, null, 'Sweet-resinous, old wood, amber, ambergris, and dry.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/absolutes/labdanum-absolute/'),
  ('Labdanum', 5, null, 'PerfumersWorld', null, 'Absolute', null, null, 'Leather, castoreum, animalic, balsamic, amber, fruity, tobacco, rich, sweet, herbaceous-balsamic.', 'https://www.perfumersworld.com/view.php?pro_id=8UQ08219'),
  ('Sandalwood', 6, null, 'Lebermuth', null, 'Essential Oil', 'India', null, 'Sweet aromatic wood, and roseacious odor.', 'https://shop.lebermuth.com/products/sandalwood-east-indian?_pos=2&_sid=aac3a3677&_ss=r'),
  ('Sandalwood', 6, null, 'Camden-Grey', null, 'Essential Oil', 'New Caledonia', null, 'Sweet, woody odor.', 'https://www.camdengrey.com/essential-oils/sandalwood-new-caledonia.html'),
  ('Sandalwood', 6, null, 'PerfumersWorld ', null, 'Fragrance Oil', null, null, 'Heart Notes: Wood, Zolvent, Linalool, Balsam, Earthy.
  Top Notes: Heavy.
  Bottom Notes: Wood, Linalool, Balsam, Zolvent.', 'https://www.perfumersworld.com/view.php?pro_id=6WX12457'),
  ('Cedarwood', 6, null, 'PerfumersWorld', null, 'Essential Oil', 'China', null, 'Woody, burnt, musty, cedar.', 'https://www.perfumersworld.com/view.php?pro_id=7WP00844'),
  ('Cedarwood', 6, null, 'Lebermuth', null, 'Essential Oil', 'India', null, 'Sweet aromatic wood, roseacious odor.', 'https://shop.lebermuth.com/products/cedarwood-himalayan-oil?_pos=3&_sid=121483bad&_ss=r'),
  ('Cedarwood', 6, null, 'Camden-Grey', null, 'Essential Oil', 'Morocco', 'Atlas', 'Woody, pencil-shavings, dry, balsamic, clean, amber, and fixative.', 'https://www.camdengrey.com/essential-oils/cedarwood-atlas.html'),
  ('Cedarwood', 6, 'Fresh', 'Pell Wall', null, 'Essential Oil', 'USA', 'Virginia', 'Woody, pencil-shavings, dry, balsamic, clean, amber. Fixative.', 'https://pellwall.com/shop/ingredienats-for-perfumery/natural-ingredients/essentialoils/cedarwood-virginian-fresh/'),
  ('Sandalwood', 6, null, 'Pell Wall', 'Pell Wall', 'Fragrance Oil', null, null, 'Sweet aromatic wood, and roseacious odor.', 'https://pellwall.com/shop/ingredients-for-perfumery/bases/pell-wall-specialities/sandalwood-blend/'),
  ('Vetiver', 6, 'Dark', 'Camden-Grey', null, 'Essential Oil', 'Haiti', null, 'Deep, smoky, earthy aroma.', 'https://www.camdengrey.com/essential-oils/vetiver-dark.html'),
  ('Vetiver', 6, null, 'Lebermuth', null, 'Essential Oil', 'Haiti', null, 'Deep, smoky, earthy aroma.', 'https://shop.lebermuth.com/products/vetiver-haiti?_pos=1&_sid=10d716c7f&_ss=r'),
  ('Vetiver', 6, null, 'Pell Wall', null, 'Essential Oil', 'Haiti', null, 'Sweet, heavy-woody, warm, rich, precious woods, earthy, mossy, rooty.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/vetiver-haiti/'),
  ('Vetiver', 6, null, 'PerfumersWorld', null, 'Essential Oil', 'Haiti', null, 'Heart Notes: Wood, Earthy, Animal
  Top Notes: Heavy, Fruit
  Bottom Notes: Wood, Earthy, Animal, Fruit', 'https://www.perfumersworld.com/view.php?pro_id=6WY09425'),
  ('Oakmoss', 7, 'IFRA Compliant', 'Pell Wall', 'Payan Bertrand', 'Absolute', null, null, 'Green, woody, mossy, earthy, seaweed, tobacco-like. Very Substantive.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/absolutes/oakmoss-absolute-ifra-compliant/'),
  ('Oakmoss', 7, null, 'PerfumersWorld', null, 'Absolute', null, null, 'Sweet, green, quinoline, grassy, marine, forest, oily, woody, earthy, mossy, rich, leather.', 'https://www.perfumersworld.com/view.php?pro_id=8YH00328'),
  ('Basil', 8, 'Organic, Sweet', 'Lebermuth', null, 'Essential Oil', 'Egypt', null, 'This organic flavor is initially peppery and evolves to slightly sweet. Basil carries a delicate menthol aroma.', 'https://shop.lebermuth.com/products/basil-sweet-organic?_pos=3&_sid=c275d8dcd&_ss=r'),
  ('Basil', 8, 'Sweet', 'Camden-Grey', null, 'Essential Oil', 'India', null, 'Warm, spicy, and herbal.', 'https://www.camdengrey.com/essential-oils/basil.html'),
  ('Basil', 8, null, 'Pell Wall', null, 'Essential Oil', null, null, 'Basil, anise, sweet, herbal-green, spicy.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/basil-oil-mc/'),
  ('Basil', 8, null, 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Top Notes: Soft.
  Bottom Notes: Faint.', 'https://www.perfumersworld.com/view.php?pro_id=6PS12413'),
  ('Clary Sage', 8, null, 'Camden-Grey', null, 'Essential Oil', 'France', null, 'Fruity, floral, herbaceous, and heavy', 'https://www.camdengrey.com/essential-oils/clary-sage-france.html'),
  ('Clary Sage', 8, null, 'Lebermuth', null, 'Essential Oil', 'France', null, 'Sweet, nutty herbaceous scent.', 'https://shop.lebermuth.com/products/sage-clary?_pos=1&_sid=f2092bce8&_ss=r'),
  ('Clary Sage', 8, null, 'Pell Wall', null, 'Essential Oil', 'France', null, 'Sweet-herbal, deep-green, tea, balsamic, amber, and spicy. Tenacious.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/clary-sage-oil/'),
  ('Clary Sage', 8, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Herbaceous, lavender, grassy-balsamic, warm-musk, warm, sweet, nutty-herbaceous scent.', 'https://www.perfumersworld.com/view.php?pro_id=7HH00121'),
  ('Rosemary', 8, 'Organic', 'Lebermuth', null, 'Essential Oil', 'Morocco', null, 'Strong, fresh woody-herbaceous odor. ', 'https://shop.lebermuth.com/products/rosemary-organic-oil?_pos=4&_sid=51a5e682f&_ss=r'),
  ('Rosemary', 8, null, 'Camden-Grey', null, 'Essential Oil', 'Spain', null, 'Strong, fresh, penetrating, camphoraceous and herbaceous odor.', 'https://www.camdengrey.com/essential-oils/rosemary.html'),
  ('Rosemary', 8, null, 'PerfumersWorld', null, 'Essential Oil', 'Spain', null, 'Fresh, strong, camphor, woody, balsam, herbal, minty, camphoraceous, floral-herb, cool, eucalyptus, grassy-balsamic, strong, minty-herbaceous scent, with a woody-balsamic undertone. Poor-quality oils have a strong comphoraceous note.', 'https://www.perfumersworld.com/view.php?pro_id=7HB00400'),
  ('Rosemary', 8, null, 'Pell Wall', null, 'Essential Oil', 'Tunisia', null, 'Fresh-herbal, clean, leafy, woody-balsamic.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/rosemary-oil/'),
  ('Bergamot', 9, null, 'Camden-Grey', null, 'Essential Oil', 'Italy', null, 'Uplifting, spicy, sweet. Like orange and lemons with floral overtones.', 'https://www.camdengrey.com/essential-oils/bergamot.html'),
  ('Bergamot', 9, null, 'Lebermuth', null, 'Essential Oil', 'Italy', null, 'Fresh, fruity-sweet citrus notes with slightly spicy balsamic undertones.', 'https://shop.lebermuth.com/products/bergamot-organic-oil?_pos=2&_sid=b0d765616&_ss=r'),
  ('Bergamot', 9, null, 'Pell Wall', 'Azelis', 'Essential Oil', 'Italy', null, 'Citrus, earl grey tea, fresh, aldehydic.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/bergamot/'),
  ('Bergamot', 9, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Citrus, woody, orange, linalyl, acetate, fresh, citrus-floral, terpene, sweet-floral, herbal, bitter.', 'https://www.perfumersworld.com/view.php?pro_id=7CL00061'),
  ('Lemon', 9, null, 'Camden-Grey', null, 'Essential Oil', 'Argentina', null, 'Clean and sharp citrus aroma.', 'https://www.camdengrey.com/essential-oils/lemon.html'),
  ('Lemon', 9, null, 'Lebermuth', null, 'Essential Oil', 'Argentina', null, 'Citrus lemon odor.', 'https://shop.lebermuth.com/products/lemon-argentina-oil?_pos=3&_sid=a98ce4466&_ss=r'),
  ('Lemon', 9, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Strong, fresh, citrusy, lemon.', 'https://www.perfumersworld.com/view.php?pro_id=7CC00271'),
  ('Lemon', 9, null, 'Pell Wall', 'Capua', 'Essential Oil', 'Turkey', null, 'Fresh-lemon, citrus, sharp, aldehydic.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/lemon-oil/'),
  ('Neroli', 9, null, 'Camden-Grey', null, 'Essential Oil', 'Egypt', null, 'A powerful, but delicate bitter-sweet floral fragrance.', 'https://www.camdengrey.com/essential-oils/neroli-morocco.html'),
  ('Neroli', 9, null, 'Pell Wall', null, 'Essential Oil', 'France', null, 'Floral-orange flower, fresh, sweet.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/essentialoils/neroli-oil/'),
  ('Neroli', 9, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Fresh, citrus, terpene, sweet-floral.', 'https://www.perfumersworld.com/view.php?pro_id=7CN00318'),
  ('Blueberry', 10, null, 'Lebermuth', null, 'Essential Oil', null, null, 'Fresh, juicy blueberries come to life in this full-bodied, fruity scent. Juicy blueberry, strawberry, cherry, raspberry and apple notes come together with a light vanilla base.', 'https://shop.lebermuth.com/products/oil-blueberry?_pos=1&_sid=e5ebc3b01&_ss=r'),
  ('Cherry', 10, null, 'Camden-Grey', null, 'Kernel Oil', 'Italy', null, 'Sweet, fruity, pungent, brown and nutty with an almond and cherry nuance.', 'https://www.camdengrey.com/essential-oils/cherry-kernel-oil.html'),
  ('Cherry', 10, null, 'Lebermuth', null, 'Fragrance Oil', null, null, 'Hypnotic black cherry infused with hints of jasmine and light powder notes.', 'https://shop.lebermuth.com/products/oil-cherry-black?_pos=1&_sid=510d874b0&_ss=r'),
  ('Cherry', 10, 'Accord', 'Pell Wall', 'Pell Wall', 'Fragrance Oil', null, null, 'Sweeter, sharper, more crisp, and lighter on the marzipan note than most.', 'https://pellwall.com/shop/ingredients-for-perfumery/bases/pell-wall-specialities/cherry-accord/#tab-description'),
  ('Cherry', 10, null, 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Heart Notes: Vanilla, Iris, Linalool, Musk, Rose, Narcotic, Spice, Wood, Phenol.
  Top Notes: Light, Fruit, Green, Dairy.
  Bottom Notes: Vanilla, Fruit, Iris, Dairy, Musk, Linalool, Green, Wood, Muguet, Spice.', 'https://www.perfumersworld.com/view.php?pro_id=6FN09071'),
  ('Peach', 10, null, 'Camden-Grey', null, 'Kernel Oil', 'Italy', null, 'Similar to apricot kernel and sweet almond oils.', 'https://www.camdengrey.com/essential-oils/peach-kernel-oil.html'),
  ('Peach', 10, 'Accord', 'Pell Wall', 'Pell Wall', 'Fragrance Oil', null, null, 'Fresh peaches.', 'https://pellwall.com/shop/ingredients-for-perfumery/bases/pell-wall-specialities/peach-accord/'),
  ('Peach', 10, null, 'PerfumersWorld', null, 'Fragrance Oil', null, null, 'Heart Notes: Musk, Linalool, Zolvent, Animal.
  Top Notes: Soft, Dairy, Green, Fruit.
  Bottom Notes: Musk, Green, Linalool, Zolvent, Muguet, Animal, Wood.', 'https://www.perfumersworld.com/view.php?pro_id=6FD08610'),
  ('Galbanum', 11, null, 'Pell Wall', null, 'Resinoid', null, null, 'Deep-green, woody, balsamic, dry, herbal, earthy, hyacinth. Tenacious, fixative.', 'https://pellwall.com/shop/ingredients-for-perfumery/natural-ingredients/resins/galbanum-resinoid/'),
  ('Galbanum', 11, null, 'PerfumersWorld', null, 'Essential Oil', null, null, 'Woody, green, fresh, earthy, rooty, balsam, green, dark-leafy, herb, earthy, sulphurous, galbanum, balsam, resinous, hyacinth, green-woody, and soft balsamic undertone.', 'https://www.perfumersworld.com/view.php?pro_id=7GQ00200'),
  ('Lily of the Valley', 11, null, 'Lebermuth', null, 'Fragrance Oil', null, null, 'A classic lily of the valley with heart notes of jasmine, rose, and lilac.', 'https://shop.lebermuth.com/products/oil-lily-of-the-valley-i?_pos=1&_sid=4ac5141e2&_ss=r');

INSERT INTO comments (scents_id, comment, users_id)
VALUES
  (1, 'Smells soothing!', 1),
  (1, 'Refreshing', 2);

INSERT INTO ratings (scents_id, rating, users_id)
VALUES
  (1, 4, 1),
  (1, 5, 2);

COMMIT;