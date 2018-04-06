# gatsby-transformer-estates

[![Build Status](https://travis-ci.org/jroehl/gatsby-transformer-estates.svg?branch=master)](https://travis-ci.org/jroehl/gatsby-transformer-estates)
[![npm](https://img.shields.io/npm/v/gatsby-transformer-estates.svg)](https://www.npmjs.com/package/gatsby-transformer-estates)
[![Code Style](https://img.shields.io/badge/code%20style-eslint--airbnb-brightgreen.svg)](https://github.com/mycsHQ/eslint-config-airbnb)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This plugin transforms the estates that where fetched by the [gatsby-source-is24](https://github.com/jroehl/gatsby-source-is24) plugin. The properties are normalized and reduced to the keys in the config file. The fields and maxDimensions of the attachments can additionally be specified as options.

- [gatsby-transformer-estates](#gatsby-transformer-estates)
  - [Install](#install)
  - [How to use](#how-to-use)
  - [How to query](#how-to-query)
  - [TODO](#todo)

## Install

`npm install --save gatsby-transformer-estates`

## How to use

```javascript
// In your gatsby-config.js

// without options
`gatsby-transformer-estates`

// OR

// with options
plugins: [
  resolve: `gatsby-transformer-estates`,
  options: {
    // optional option properties
    // fields = [default_fields], // The whitelisted fields to be kept in sanitized data
    // maxDimensions = { // the max dimensions the image urls should be scaled to
    //   height: 3000,
    //   width: 3000
    // },
  }
]
```

## How to query

You can query npm nodes like the following

```graphql
allEstatesSanitized {
  allIs24EstatesSanitized {
    edges {
      node {
        id
        title
      }
    }
  }
}

singleEstateSanitized {
  is24EstatesSanitized(id: { eq: "123456" }) {
    id
    title
  }
}
```

## TODO

* write tests
* Roll out for other types
