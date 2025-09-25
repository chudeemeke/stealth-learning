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
