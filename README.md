# checkout-submodule

This Action makes checkout private submodule simply

# Usage

**Checkout submodule `foo`**

```
- uses: Mushus/checkout-submodule@v1
  with:
    submodulePath: ./foo
```

**Checkout submodule `bar` with deploy key `DEPLOY_KEY_BAR`**

```
- uses: Mushus/checkout-submodule@v1
  with:
    submodulePath: ./bar
    identifier: ${{ secret.DEPLOY_KEY_BAR }}
```

`identifier` is a identifier file contents

**Checkout submodule `foo` in repository `bar`**

```
- uses: Mushus/checkout-submodule@v1
  with:
    basePath: ./bar
    submodulePath: ./foo
```
