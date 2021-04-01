# Label when approved

A GitHub Action to add/remove a label when a pull request is reviewed.

## Usage

### Create Workflow

Create a workflow (eg: `.github/workflows/label-approved.yml` see [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)) to utilize the label-when-approved action with content:

```yaml
name: Label approved PR
on: pull_request_review
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      # …
      - uses: ableco/label-when-approved-action@main
        with:
          approvals: 2
          add-label: delivered
```


## Contributing

Contributions are welcome. Please check out the [Contributing guide](CONTRIBUTING.md) for the guidelines you need to follow.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) so that you can understand the kind of respectful behavior we expect of all participants.

## License

Open Source Project is released under the MIT license. See [LICENSE](LICENSE) for the full license text.
