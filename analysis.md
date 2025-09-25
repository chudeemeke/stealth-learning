## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

src/services/database/DatabaseService.ts(648,57): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'IndexableType'.
  Type 'undefined' is not assignable to type 'IndexableType'.
src/services/security/InputValidationService.ts(170,7): error TS2353: Object literal may only specify known properties, and 'RETURN_DOM_IMPORT' does not exist in type 'Config'.
src/services/security/UltraJWTService.ts(305,11): error TS18046: 'refreshPayload' is of type 'unknown'.
src/services/security/UltraJWTService.ts(313,24): error TS18046: 'refreshPayload' is of type 'unknown'.
src/store/slices/analyticsSlice.ts(158,44): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(161,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(168,29): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,27): error TS2349: This expression is not callable.
  Type 'WritableDraft<{ skill: string; startLevel: number; currentLevel: number; attempts: number; lastPracticed: string; }>' has no call signatures.
src/store/slices/analyticsSlice.ts(221,35): error TS7006: Parameter 'skill' implicitly has an 'any' type.
src/store/slices/studentSlice.ts(125,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
src/store/slices/studentSlice.ts(163,9): error TS2740: Type '{}' is missing the following properties from type 'Map<string, SkillLevel>': clear, delete, forEach, get, and 8 more.
 ELIFECYCLE  Command failed with exit code 2.
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1305 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/LoginPage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                              [39m[1m[2m  0.13 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.webmanifest                       [39m[1m[2m  0.56 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                 [39m[1m[2m  7.04 kB[22m[1m[22m[2m │ gzip:   2.36 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-lMPGZhxp.css                  [39m[1m[2m238.33 kB[22m[1m[22m[2m │ gzip:  33.42 kB[22m
[2mdist/[22m[2massets/[22m[36mcontrast-CHbZhZgk.js                [39m[1m[2m  1.52 kB[22m[1m[22m[2m │ gzip:   0.78 kB[22m[2m │ map:     9.28 kB[22m
[2mdist/[22m[2massets/[22m[36mToastNotification-Dmk6DGHN.js       [39m[1m[2m  4.30 kB[22m[1m[22m[2m │ gzip:   1.74 kB[22m[2m │ map:    13.69 kB[22m
[2mdist/[22m[2massets/[22m[36mCard-BhvetdIy.js                    [39m[1m[2m  9.96 kB[22m[1m[22m[2m │ gzip:   3.69 kB[22m[2m │ map:    31.94 kB[22m
[2mdist/[22m[2massets/[22m[36mAuthenticationService-DPNpv3J9.js   [39m[1m[2m 11.78 kB[22m[1m[22m[2m │ gzip:   3.65 kB[22m[2m │ map:    38.38 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGameSelectPage-BERdyAVQ.js  [39m[1m[2m 15.40 kB[22m[1m[22m[2m │ gzip:   5.13 kB[22m[2m │ map:    43.76 kB[22m
[2mdist/[22m[2massets/[22m[36mProfilePage-BNgBHHtJ.js             [39m[1m[2m 15.96 kB[22m[1m[22m[2m │ gzip:   4.16 kB[22m[2m │ map:    39.44 kB[22m
[2mdist/[22m[2massets/[22m[36mSettingsPage-ATLoCSzT.js            [39m[1m[2m 21.71 kB[22m[1m[22m[2m │ gzip:   4.23 kB[22m[2m │ map:    56.99 kB[22m
[2mdist/[22m[2massets/[22m[36mAudioService-BVDbD2cP.js            [39m[1m[2m 24.72 kB[22m[1m[22m[2m │ gzip:   8.08 kB[22m[2m │ map:    71.83 kB[22m
[2mdist/[22m[2massets/[22m[36mredux-vendor-DBVP5wfx.js            [39m[1m[2m 26.91 kB[22m[1m[22m[2m │ gzip:  10.26 kB[22m[2m │ map:   250.87 kB[22m
[2mdist/[22m[2massets/[22m[36mParentDashboard-CN0Nrr7c.js         [39m[1m[2m 31.51 kB[22m[1m[22m[2m │ gzip:   9.12 kB[22m[2m │ map:    97.59 kB[22m
[2mdist/[22m[2massets/[22m[36mProgressPage-CEuHFPxl.js            [39m[1m[2m 38.70 kB[22m[1m[22m[2m │ gzip:   9.57 kB[22m[2m │ map:   126.12 kB[22m
[2mdist/[22m[2massets/[22m[36mgame-vendor-CRVhuPj5.js             [39m[1m[2m 47.19 kB[22m[1m[22m[2m │ gzip:  14.14 kB[22m[2m │ map:   198.59 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGamePlayPage-CxRan7qD.js    [39m[1m[2m 72.06 kB[22m[1m[22m[2m │ gzip:  21.73 kB[22m[2m │ map:   195.68 kB[22m
[2mdist/[22m[2massets/[22m[36mui-vendor-B09qj1ZG.js               [39m[1m[2m103.95 kB[22m[1m[22m[2m │ gzip:  35.19 kB[22m[2m │ map:   605.87 kB[22m
[2mdist/[22m[2massets/[22m[36mDatabaseService-gsIjamZ0.js         [39m[1m[2m115.14 kB[22m[1m[22m[2m │ gzip:  37.37 kB[22m[2m │ map:   303.71 kB[22m
[2mdist/[22m[2massets/[22m[36mreact-vendor-CnU47n7y.js            [39m[1m[2m162.72 kB[22m[1m[22m[2m │ gzip:  53.07 kB[22m[2m │ map:   703.04 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-BFYWwnwp.js                   [39m[1m[2m342.28 kB[22m[1m[22m[2m │ gzip:  99.86 kB[22m[2m │ map: 1,357.93 kB[22m
[2mdist/[22m[2massets/[22m[36mPieChart-CWGuFQzw.js                [39m[1m[2m399.25 kB[22m[1m[22m[2m │ gzip: 108.20 kB[22m[2m │ map: 1,758.89 kB[22m
[32m✓ built in 8.29s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m23 entries[39m [2m(1653.09 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-5331831e.js.map[22m
  [2mdist/workbox-5331831e.js[22m
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1305 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/LoginPage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                              [39m[1m[2m  0.13 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.webmanifest                       [39m[1m[2m  0.56 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                 [39m[1m[2m  7.04 kB[22m[1m[22m[2m │ gzip:   2.36 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-lMPGZhxp.css                  [39m[1m[2m238.33 kB[22m[1m[22m[2m │ gzip:  33.42 kB[22m
[2mdist/[22m[2massets/[22m[36mcontrast-CHbZhZgk.js                [39m[1m[2m  1.52 kB[22m[1m[22m[2m │ gzip:   0.78 kB[22m[2m │ map:     9.28 kB[22m
[2mdist/[22m[2massets/[22m[36mToastNotification-Dmk6DGHN.js       [39m[1m[2m  4.30 kB[22m[1m[22m[2m │ gzip:   1.74 kB[22m[2m │ map:    13.69 kB[22m
[2mdist/[22m[2massets/[22m[36mCard-BhvetdIy.js                    [39m[1m[2m  9.96 kB[22m[1m[22m[2m │ gzip:   3.69 kB[22m[2m │ map:    31.94 kB[22m
[2mdist/[22m[2massets/[22m[36mAuthenticationService-DPNpv3J9.js   [39m[1m[2m 11.78 kB[22m[1m[22m[2m │ gzip:   3.65 kB[22m[2m │ map:    38.38 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGameSelectPage-BERdyAVQ.js  [39m[1m[2m 15.40 kB[22m[1m[22m[2m │ gzip:   5.13 kB[22m[2m │ map:    43.76 kB[22m
[2mdist/[22m[2massets/[22m[36mProfilePage-BNgBHHtJ.js             [39m[1m[2m 15.96 kB[22m[1m[22m[2m │ gzip:   4.16 kB[22m[2m │ map:    39.44 kB[22m
[2mdist/[22m[2massets/[22m[36mSettingsPage-ATLoCSzT.js            [39m[1m[2m 21.71 kB[22m[1m[22m[2m │ gzip:   4.23 kB[22m[2m │ map:    56.99 kB[22m
[2mdist/[22m[2massets/[22m[36mAudioService-BVDbD2cP.js            [39m[1m[2m 24.72 kB[22m[1m[22m[2m │ gzip:   8.08 kB[22m[2m │ map:    71.83 kB[22m
[2mdist/[22m[2massets/[22m[36mredux-vendor-DBVP5wfx.js            [39m[1m[2m 26.91 kB[22m[1m[22m[2m │ gzip:  10.26 kB[22m[2m │ map:   250.87 kB[22m
[2mdist/[22m[2massets/[22m[36mParentDashboard-CN0Nrr7c.js         [39m[1m[2m 31.51 kB[22m[1m[22m[2m │ gzip:   9.12 kB[22m[2m │ map:    97.59 kB[22m
[2mdist/[22m[2massets/[22m[36mProgressPage-CEuHFPxl.js            [39m[1m[2m 38.70 kB[22m[1m[22m[2m │ gzip:   9.57 kB[22m[2m │ map:   126.12 kB[22m
[2mdist/[22m[2massets/[22m[36mgame-vendor-CRVhuPj5.js             [39m[1m[2m 47.19 kB[22m[1m[22m[2m │ gzip:  14.14 kB[22m[2m │ map:   198.59 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGamePlayPage-CxRan7qD.js    [39m[1m[2m 72.06 kB[22m[1m[22m[2m │ gzip:  21.73 kB[22m[2m │ map:   195.68 kB[22m
[2mdist/[22m[2massets/[22m[36mui-vendor-B09qj1ZG.js               [39m[1m[2m103.95 kB[22m[1m[22m[2m │ gzip:  35.19 kB[22m[2m │ map:   605.87 kB[22m
[2mdist/[22m[2massets/[22m[36mDatabaseService-gsIjamZ0.js         [39m[1m[2m115.14 kB[22m[1m[22m[2m │ gzip:  37.37 kB[22m[2m │ map:   303.71 kB[22m
[2mdist/[22m[2massets/[22m[36mreact-vendor-CnU47n7y.js            [39m[1m[2m162.72 kB[22m[1m[22m[2m │ gzip:  53.07 kB[22m[2m │ map:   703.04 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-BFYWwnwp.js                   [39m[1m[2m342.28 kB[22m[1m[22m[2m │ gzip:  99.86 kB[22m[2m │ map: 1,357.93 kB[22m
[2mdist/[22m[2massets/[22m[36mPieChart-CWGuFQzw.js                [39m[1m[2m399.25 kB[22m[1m[22m[2m │ gzip: 108.20 kB[22m[2m │ map: 1,758.89 kB[22m
[32m✓ built in 7.77s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m23 entries[39m [2m(1653.09 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-5331831e.js.map[22m
  [2mdist/workbox-5331831e.js[22m
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1305 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/LoginPage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                              [39m[1m[2m  0.13 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.webmanifest                       [39m[1m[2m  0.56 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                 [39m[1m[2m  7.04 kB[22m[1m[22m[2m │ gzip:   2.36 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-lMPGZhxp.css                  [39m[1m[2m238.33 kB[22m[1m[22m[2m │ gzip:  33.42 kB[22m
[2mdist/[22m[2massets/[22m[36mcontrast-CHbZhZgk.js                [39m[1m[2m  1.52 kB[22m[1m[22m[2m │ gzip:   0.78 kB[22m[2m │ map:     9.28 kB[22m
[2mdist/[22m[2massets/[22m[36mToastNotification-Dmk6DGHN.js       [39m[1m[2m  4.30 kB[22m[1m[22m[2m │ gzip:   1.74 kB[22m[2m │ map:    13.69 kB[22m
[2mdist/[22m[2massets/[22m[36mCard-BhvetdIy.js                    [39m[1m[2m  9.96 kB[22m[1m[22m[2m │ gzip:   3.69 kB[22m[2m │ map:    31.94 kB[22m
[2mdist/[22m[2massets/[22m[36mAuthenticationService-DPNpv3J9.js   [39m[1m[2m 11.78 kB[22m[1m[22m[2m │ gzip:   3.65 kB[22m[2m │ map:    38.38 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGameSelectPage-BERdyAVQ.js  [39m[1m[2m 15.40 kB[22m[1m[22m[2m │ gzip:   5.13 kB[22m[2m │ map:    43.76 kB[22m
[2mdist/[22m[2massets/[22m[36mProfilePage-BNgBHHtJ.js             [39m[1m[2m 15.96 kB[22m[1m[22m[2m │ gzip:   4.16 kB[22m[2m │ map:    39.44 kB[22m
[2mdist/[22m[2massets/[22m[36mSettingsPage-ATLoCSzT.js            [39m[1m[2m 21.71 kB[22m[1m[22m[2m │ gzip:   4.23 kB[22m[2m │ map:    56.99 kB[22m
[2mdist/[22m[2massets/[22m[36mAudioService-BVDbD2cP.js            [39m[1m[2m 24.72 kB[22m[1m[22m[2m │ gzip:   8.08 kB[22m[2m │ map:    71.83 kB[22m
[2mdist/[22m[2massets/[22m[36mredux-vendor-DBVP5wfx.js            [39m[1m[2m 26.91 kB[22m[1m[22m[2m │ gzip:  10.26 kB[22m[2m │ map:   250.87 kB[22m
[2mdist/[22m[2massets/[22m[36mParentDashboard-CN0Nrr7c.js         [39m[1m[2m 31.51 kB[22m[1m[22m[2m │ gzip:   9.12 kB[22m[2m │ map:    97.59 kB[22m
[2mdist/[22m[2massets/[22m[36mProgressPage-CEuHFPxl.js            [39m[1m[2m 38.70 kB[22m[1m[22m[2m │ gzip:   9.57 kB[22m[2m │ map:   126.12 kB[22m
[2mdist/[22m[2massets/[22m[36mgame-vendor-CRVhuPj5.js             [39m[1m[2m 47.19 kB[22m[1m[22m[2m │ gzip:  14.14 kB[22m[2m │ map:   198.59 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGamePlayPage-CxRan7qD.js    [39m[1m[2m 72.06 kB[22m[1m[22m[2m │ gzip:  21.73 kB[22m[2m │ map:   195.68 kB[22m
[2mdist/[22m[2massets/[22m[36mui-vendor-B09qj1ZG.js               [39m[1m[2m103.95 kB[22m[1m[22m[2m │ gzip:  35.19 kB[22m[2m │ map:   605.87 kB[22m
[2mdist/[22m[2massets/[22m[36mDatabaseService-gsIjamZ0.js         [39m[1m[2m115.14 kB[22m[1m[22m[2m │ gzip:  37.37 kB[22m[2m │ map:   303.71 kB[22m
[2mdist/[22m[2massets/[22m[36mreact-vendor-CnU47n7y.js            [39m[1m[2m162.72 kB[22m[1m[22m[2m │ gzip:  53.07 kB[22m[2m │ map:   703.04 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-BFYWwnwp.js                   [39m[1m[2m342.28 kB[22m[1m[22m[2m │ gzip:  99.86 kB[22m[2m │ map: 1,357.93 kB[22m
[2mdist/[22m[2massets/[22m[36mPieChart-CWGuFQzw.js                [39m[1m[2m399.25 kB[22m[1m[22m[2m │ gzip: 108.20 kB[22m[2m │ map: 1,758.89 kB[22m
[32m✓ built in 7.90s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m23 entries[39m [2m(1653.09 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-5331831e.js.map[22m
  [2mdist/workbox-5331831e.js[22m
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1305 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/LoginPage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                              [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.webmanifest                       [39m[1m[2m  0.59 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                 [39m[1m[2m  7.17 kB[22m[1m[22m[2m │ gzip:   2.37 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-lMPGZhxp.css                  [39m[1m[2m238.33 kB[22m[1m[22m[2m │ gzip:  33.42 kB[22m
[2mdist/[22m[2massets/[22m[36mcontrast-CHbZhZgk.js                [39m[1m[2m  1.52 kB[22m[1m[22m[2m │ gzip:   0.78 kB[22m[2m │ map:     9.28 kB[22m
[2mdist/[22m[2massets/[22m[36mToastNotification-LdrnV6tW.js       [39m[1m[2m  4.30 kB[22m[1m[22m[2m │ gzip:   1.74 kB[22m[2m │ map:    13.69 kB[22m
[2mdist/[22m[2massets/[22m[36mCard-B5OO89Pt.js                    [39m[1m[2m  9.96 kB[22m[1m[22m[2m │ gzip:   3.70 kB[22m[2m │ map:    31.94 kB[22m
[2mdist/[22m[2massets/[22m[36mAuthenticationService-DMBCmwa3.js   [39m[1m[2m 11.78 kB[22m[1m[22m[2m │ gzip:   3.65 kB[22m[2m │ map:    38.38 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGameSelectPage-UMP9sPys.js  [39m[1m[2m 15.40 kB[22m[1m[22m[2m │ gzip:   5.13 kB[22m[2m │ map:    43.76 kB[22m
[2mdist/[22m[2massets/[22m[36mProfilePage-BVDwB-qj.js             [39m[1m[2m 15.96 kB[22m[1m[22m[2m │ gzip:   4.16 kB[22m[2m │ map:    39.44 kB[22m
[2mdist/[22m[2massets/[22m[36mSettingsPage-DRAS93ol.js            [39m[1m[2m 21.71 kB[22m[1m[22m[2m │ gzip:   4.23 kB[22m[2m │ map:    56.99 kB[22m
[2mdist/[22m[2massets/[22m[36mAudioService-DWNGDfD9.js            [39m[1m[2m 24.72 kB[22m[1m[22m[2m │ gzip:   8.08 kB[22m[2m │ map:    71.83 kB[22m
[2mdist/[22m[2massets/[22m[36mredux-vendor-DBVP5wfx.js            [39m[1m[2m 26.91 kB[22m[1m[22m[2m │ gzip:  10.26 kB[22m[2m │ map:   250.87 kB[22m
[2mdist/[22m[2massets/[22m[36mParentDashboard-C38TsWVo.js         [39m[1m[2m 31.51 kB[22m[1m[22m[2m │ gzip:   9.12 kB[22m[2m │ map:    97.59 kB[22m
[2mdist/[22m[2massets/[22m[36mProgressPage-CWFp0l_9.js            [39m[1m[2m 38.70 kB[22m[1m[22m[2m │ gzip:   9.58 kB[22m[2m │ map:   126.12 kB[22m
[2mdist/[22m[2massets/[22m[36mgame-vendor-CRVhuPj5.js             [39m[1m[2m 47.19 kB[22m[1m[22m[2m │ gzip:  14.14 kB[22m[2m │ map:   198.59 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGamePlayPage-tO1WK9HG.js    [39m[1m[2m 72.06 kB[22m[1m[22m[2m │ gzip:  21.73 kB[22m[2m │ map:   195.68 kB[22m
[2mdist/[22m[2massets/[22m[36mui-vendor-B09qj1ZG.js               [39m[1m[2m103.95 kB[22m[1m[22m[2m │ gzip:  35.19 kB[22m[2m │ map:   605.87 kB[22m
[2mdist/[22m[2massets/[22m[36mDatabaseService-B_c6onA7.js         [39m[1m[2m115.14 kB[22m[1m[22m[2m │ gzip:  37.37 kB[22m[2m │ map:   303.71 kB[22m
[2mdist/[22m[2massets/[22m[36mreact-vendor-CnU47n7y.js            [39m[1m[2m162.72 kB[22m[1m[22m[2m │ gzip:  53.07 kB[22m[2m │ map:   703.04 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-DK02Nxh0.js                   [39m[1m[2m342.31 kB[22m[1m[22m[2m │ gzip:  99.87 kB[22m[2m │ map: 1,357.93 kB[22m
[2mdist/[22m[2massets/[22m[36mPieChart-CWGuFQzw.js                [39m[1m[2m399.25 kB[22m[1m[22m[2m │ gzip: 108.20 kB[22m[2m │ map: 1,758.89 kB[22m
[32m✓ built in 7.80s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m23 entries[39m [2m(1653.29 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-5331831e.js.map[22m
  [2mdist/workbox-5331831e.js[22m
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
## Running Comprehensive Analysis
### TypeScript Errors

> stealth-learning-spa@0.1.0-dev type-check /home/runner/work/stealth-learning/stealth-learning
> tsc --noEmit

### Lint Errors

> stealth-learning-spa@0.1.0-dev lint /home/runner/work/stealth-learning/stealth-learning
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 -c config/.eslintrc.cjs


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/stealth-learning/stealth-learning/config/.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

 ELIFECYCLE  Command failed with exit code 2.
### Test Results
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "test:unit" not found

Did you mean "pnpm test:ui"?
### Build Status

> stealth-learning-spa@0.1.0-dev build /home/runner/work/stealth-learning/stealth-learning
> tsc && vite build

[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1305 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/LoginPage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                              [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.webmanifest                       [39m[1m[2m  0.59 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                 [39m[1m[2m  7.17 kB[22m[1m[22m[2m │ gzip:   2.37 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-lMPGZhxp.css                  [39m[1m[2m238.33 kB[22m[1m[22m[2m │ gzip:  33.42 kB[22m
[2mdist/[22m[2massets/[22m[36mcontrast-CHbZhZgk.js                [39m[1m[2m  1.52 kB[22m[1m[22m[2m │ gzip:   0.78 kB[22m[2m │ map:     9.28 kB[22m
[2mdist/[22m[2massets/[22m[36mToastNotification-LdrnV6tW.js       [39m[1m[2m  4.30 kB[22m[1m[22m[2m │ gzip:   1.74 kB[22m[2m │ map:    13.69 kB[22m
[2mdist/[22m[2massets/[22m[36mCard-B5OO89Pt.js                    [39m[1m[2m  9.96 kB[22m[1m[22m[2m │ gzip:   3.70 kB[22m[2m │ map:    31.94 kB[22m
[2mdist/[22m[2massets/[22m[36mAuthenticationService-DMBCmwa3.js   [39m[1m[2m 11.78 kB[22m[1m[22m[2m │ gzip:   3.65 kB[22m[2m │ map:    38.38 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGameSelectPage-UMP9sPys.js  [39m[1m[2m 15.40 kB[22m[1m[22m[2m │ gzip:   5.13 kB[22m[2m │ map:    43.76 kB[22m
[2mdist/[22m[2massets/[22m[36mProfilePage-BVDwB-qj.js             [39m[1m[2m 15.96 kB[22m[1m[22m[2m │ gzip:   4.16 kB[22m[2m │ map:    39.44 kB[22m
[2mdist/[22m[2massets/[22m[36mSettingsPage-DRAS93ol.js            [39m[1m[2m 21.71 kB[22m[1m[22m[2m │ gzip:   4.23 kB[22m[2m │ map:    56.99 kB[22m
[2mdist/[22m[2massets/[22m[36mAudioService-DWNGDfD9.js            [39m[1m[2m 24.72 kB[22m[1m[22m[2m │ gzip:   8.08 kB[22m[2m │ map:    71.83 kB[22m
[2mdist/[22m[2massets/[22m[36mredux-vendor-DBVP5wfx.js            [39m[1m[2m 26.91 kB[22m[1m[22m[2m │ gzip:  10.26 kB[22m[2m │ map:   250.87 kB[22m
[2mdist/[22m[2massets/[22m[36mParentDashboard-C38TsWVo.js         [39m[1m[2m 31.51 kB[22m[1m[22m[2m │ gzip:   9.12 kB[22m[2m │ map:    97.59 kB[22m
[2mdist/[22m[2massets/[22m[36mProgressPage-CWFp0l_9.js            [39m[1m[2m 38.70 kB[22m[1m[22m[2m │ gzip:   9.58 kB[22m[2m │ map:   126.12 kB[22m
[2mdist/[22m[2massets/[22m[36mgame-vendor-CRVhuPj5.js             [39m[1m[2m 47.19 kB[22m[1m[22m[2m │ gzip:  14.14 kB[22m[2m │ map:   198.59 kB[22m
[2mdist/[22m[2massets/[22m[36mEnhancedGamePlayPage-tO1WK9HG.js    [39m[1m[2m 72.06 kB[22m[1m[22m[2m │ gzip:  21.73 kB[22m[2m │ map:   195.68 kB[22m
[2mdist/[22m[2massets/[22m[36mui-vendor-B09qj1ZG.js               [39m[1m[2m103.95 kB[22m[1m[22m[2m │ gzip:  35.19 kB[22m[2m │ map:   605.87 kB[22m
[2mdist/[22m[2massets/[22m[36mDatabaseService-B_c6onA7.js         [39m[1m[2m115.14 kB[22m[1m[22m[2m │ gzip:  37.37 kB[22m[2m │ map:   303.71 kB[22m
[2mdist/[22m[2massets/[22m[36mreact-vendor-CnU47n7y.js            [39m[1m[2m162.72 kB[22m[1m[22m[2m │ gzip:  53.07 kB[22m[2m │ map:   703.04 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-DK02Nxh0.js                   [39m[1m[2m342.31 kB[22m[1m[22m[2m │ gzip:  99.87 kB[22m[2m │ map: 1,357.93 kB[22m
[2mdist/[22m[2massets/[22m[36mPieChart-CWGuFQzw.js                [39m[1m[2m399.25 kB[22m[1m[22m[2m │ gzip: 108.20 kB[22m[2m │ map: 1,758.89 kB[22m
[32m✓ built in 7.79s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m23 entries[39m [2m(1653.29 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-5331831e.js.map[22m
  [2mdist/workbox-5331831e.js[22m
### Security Audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ moderate            │ esbuild enables any website to send any requests to    │
│                     │ the development server and read the response           │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ esbuild                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ <=0.24.2                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=0.25.0                                               │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-controls@7.6.20 >                     │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild-register@3.6.0 │
│                     │ > esbuild@0.18.20                                      │
│                     │                                                        │
│                     │ . > @storybook/addon-essentials@7.6.20 >               │
│                     │ @storybook/addon-docs@7.6.20 >                         │
│                     │ @storybook/blocks@7.6.20 >                             │
│                     │ @storybook/docs-tools@7.6.20 >                         │
│                     │ @storybook/core-common@7.6.20 > esbuild@0.18.20        │
│                     │                                                        │
│                     │ ... Found 31 paths, run `pnpm why esbuild` for more    │
│                     │ information                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-67mh-4wv8-2f99      │
└─────────────────────┴────────────────────────────────────────────────────────┘
2 vulnerabilities found
Severity: 2 moderate
