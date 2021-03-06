/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import {
  FIXTURES_DIR,
  LONG_TIMEOUT_MS,
  runConvertTSLintToESLint,
  runNgAdd,
  runYarnInstall,
} from '../utils/local-registry-process';
import { requireUncached } from '../utils/require-uncached';
import { runLint } from '../utils/run-lint';

const fixtureDirectory = 'v1123-multi-project-yarn-auto-convert';

describe(fixtureDirectory, () => {
  jest.setTimeout(LONG_TIMEOUT_MS);

  beforeEach(async () => {
    process.chdir(path.join(FIXTURES_DIR, fixtureDirectory));
    await runYarnInstall();
    await runNgAdd();

    // Deliberately don't convert the root project first, so we can ensure this is also supported
    await runConvertTSLintToESLint([
      '--no-interactive',
      '--project',
      'another-app',
    ]);
    // root project
    await runConvertTSLintToESLint([
      '--no-interactive',
      '--project',
      'v1123-multi-project-yarn-auto-convert',
    ]);
    await runConvertTSLintToESLint([
      '--no-interactive',
      '--project',
      'another-lib',
    ]);
  });

  it('it should pass linting after converting the out of the box Angular CLI setup (with an additional project called "another-app" with a custom prefix set)', async () => {
    // Root project
    expect(
      requireUncached(
        '../fixtures/v1123-multi-project-yarn-auto-convert/.eslintrc.json',
      ),
    ).toMatchSnapshot();

    expect(
      requireUncached(
        '../fixtures/v1123-multi-project-yarn-auto-convert/angular.json',
      ).projects['v1123-multi-project-yarn-auto-convert'].architect.lint,
    ).toMatchSnapshot();

    // Additional project ("another-app")
    expect(
      requireUncached(
        '../fixtures/v1123-multi-project-yarn-auto-convert/projects/another-app/.eslintrc.json',
      ),
    ).toMatchSnapshot();

    expect(
      requireUncached(
        '../fixtures/v1123-multi-project-yarn-auto-convert/angular.json',
      ).projects['another-app'].architect.lint,
    ).toMatchSnapshot();

    // Additional library project ("another-lib")
    expect(
      requireUncached(
        '../fixtures/v1123-multi-project-yarn-auto-convert/projects/another-lib/.eslintrc.json',
      ),
    ).toMatchSnapshot();

    expect(
      requireUncached(
        '../fixtures/v1123-multi-project-yarn-auto-convert/angular.json',
      ).projects['another-lib'].architect.lint,
    ).toMatchSnapshot();

    const lintOutput = await runLint(fixtureDirectory);
    expect(lintOutput).toMatchSnapshot();
  });
});
