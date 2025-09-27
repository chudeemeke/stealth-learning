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
[32m✓ built in 8.07s[39m

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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1305 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/LoginPage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.39 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-8jnweyWi.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-BKvDXi8c.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-D-N-SKlK.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-CJMFN9g_.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-HeDHhLIK.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-Cmptqzg7.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BkgRSqOc.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor-B46Ao86k.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-BVj-BbsE.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-ClT0YpVZ.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-DAw2JtLp.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-D8ZR-_oG.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-sUDCZ9fD.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-CEy9AIsz.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-BJbB4DS_.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-Cxz8tfec.js            [39m[1m[2m162.96 kB[22m[1m[22m[2m │ gzip:  53.06 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-xsnxqw-K.js                   [39m[1m[2m275.15 kB[22m[1m[22m[2m │ gzip:  81.02 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CXe1uCXZ.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 7.27s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1663.58 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1305 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/LoginPage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.39 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-8jnweyWi.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-BKvDXi8c.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-D-N-SKlK.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-CJMFN9g_.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-HeDHhLIK.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-Cmptqzg7.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BkgRSqOc.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor-B46Ao86k.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-BVj-BbsE.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-ClT0YpVZ.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-DAw2JtLp.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-D8ZR-_oG.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-sUDCZ9fD.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-CEy9AIsz.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-BJbB4DS_.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-Cxz8tfec.js            [39m[1m[2m162.96 kB[22m[1m[22m[2m │ gzip:  53.06 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-xsnxqw-K.js                   [39m[1m[2m275.15 kB[22m[1m[22m[2m │ gzip:  81.02 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CXe1uCXZ.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 7.25s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1663.58 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1305 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/LoginPage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.39 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-8jnweyWi.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-BKvDXi8c.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-D-N-SKlK.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-CJMFN9g_.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-HeDHhLIK.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-Cmptqzg7.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BkgRSqOc.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor-B46Ao86k.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-BVj-BbsE.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-ClT0YpVZ.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-DAw2JtLp.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-D8ZR-_oG.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-sUDCZ9fD.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-CEy9AIsz.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-BJbB4DS_.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-Cxz8tfec.js            [39m[1m[2m162.96 kB[22m[1m[22m[2m │ gzip:  53.06 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-xsnxqw-K.js                   [39m[1m[2m275.15 kB[22m[1m[22m[2m │ gzip:  81.02 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CXe1uCXZ.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 7.30s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1663.58 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1304 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-D78lrcr5.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-Dstjd0T3.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-BR_aVwjw.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-8nYArPoR.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-CmzaK7u3.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-xdgHHCNS.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BvdTHQ2l.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-DExiRBo1.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-D3CJTVki.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-CAK-p_ML.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-C-5GRFK6.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-AuhEBs5G.js                   [39m[1m[2m273.72 kB[22m[1m[22m[2m │ gzip:  80.82 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 6.98s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1662.54 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1304 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-D78lrcr5.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-Dstjd0T3.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-BR_aVwjw.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-8nYArPoR.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-CmzaK7u3.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-xdgHHCNS.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BvdTHQ2l.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-DExiRBo1.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-D3CJTVki.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-CAK-p_ML.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-C-5GRFK6.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-AuhEBs5G.js                   [39m[1m[2m273.72 kB[22m[1m[22m[2m │ gzip:  80.82 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 6.44s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1662.54 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1304 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-D78lrcr5.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-Dstjd0T3.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-BR_aVwjw.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-8nYArPoR.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-CmzaK7u3.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-xdgHHCNS.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BvdTHQ2l.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-DExiRBo1.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-D3CJTVki.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-CAK-p_ML.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-C-5GRFK6.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-AuhEBs5G.js                   [39m[1m[2m273.72 kB[22m[1m[22m[2m │ gzip:  80.82 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 7.20s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1662.54 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1304 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-D78lrcr5.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-Dstjd0T3.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-BR_aVwjw.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-8nYArPoR.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-CmzaK7u3.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-xdgHHCNS.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BvdTHQ2l.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-DExiRBo1.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-D3CJTVki.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-CAK-p_ML.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-C-5GRFK6.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-AuhEBs5G.js                   [39m[1m[2m273.72 kB[22m[1m[22m[2m │ gzip:  80.82 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 7.29s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1662.54 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1304 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-D78lrcr5.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-Dstjd0T3.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-BR_aVwjw.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-8nYArPoR.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-CmzaK7u3.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-xdgHHCNS.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BvdTHQ2l.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-DExiRBo1.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-D3CJTVki.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-CAK-p_ML.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-C-5GRFK6.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-AuhEBs5G.js                   [39m[1m[2m273.72 kB[22m[1m[22m[2m │ gzip:  80.82 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 7.02s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1662.54 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1304 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DovDNjYW.css                     [39m[1m[2m235.87 kB[22m[1m[22m[2m │ gzip:  33.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/contrast-CHbZhZgk.js                [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-D78lrcr5.js       [39m[1m[2m  4.61 kB[22m[1m[22m[2m │ gzip:   1.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-Dstjd0T3.js                    [39m[1m[2m 11.14 kB[22m[1m[22m[2m │ gzip:   4.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-BR_aVwjw.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGameSelectPage-8nYArPoR.js  [39m[1m[2m 15.60 kB[22m[1m[22m[2m │ gzip:   5.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-CmzaK7u3.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-xdgHHCNS.js            [39m[1m[2m 21.69 kB[22m[1m[22m[2m │ gzip:   4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AudioService-BvdTHQ2l.js            [39m[1m[2m 25.67 kB[22m[1m[22m[2m │ gzip:   8.43 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-DExiRBo1.js         [39m[1m[2m 31.50 kB[22m[1m[22m[2m │ gzip:   9.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-D3CJTVki.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-CAK-p_ML.js    [39m[1m[2m 72.73 kB[22m[1m[22m[2m │ gzip:  21.98 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-C-5GRFK6.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-AuhEBs5G.js                   [39m[1m[2m273.72 kB[22m[1m[22m[2m │ gzip:  80.82 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 7.41s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m24 entries[39m [2m(1662.54 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

src/components/enhanced/EnhancedButton.tsx(244,17): error TS1117: An object literal cannot have multiple properties with the same name.
src/hooks/useQuestions.ts(67,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/hooks/useQuestions.ts(68,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,20): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,48): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(146,19): error TS2322: Type '{ children: Element[]; glass: true; glassPreset: string; className: string; onClick: () => false | void; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/ExpandedGameSelectPage.tsx(201,25): error TS2322: Type 'string' is not assignable to type '"success" | "primary" | "secondary" | "danger" | "warning" | undefined'.
src/pages/ExpandedGameSelectPage.tsx(265,17): error TS2322: Type '{ children: Element; glass: true; glassPreset: string; className: string; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/GameSelectPage.tsx(217,14): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ easy: number[]; medium: number[]; hard: number[]; }'.
  No index signature with a parameter of type 'number' was found on type '{ easy: number[]; medium: number[]; hard: number[]; }'.
src/pages/GameSelectPage.tsx(243,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(244,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(366,52): error TS2345: Argument of type '"easy"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(367,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"easy"' have no overlap.
src/pages/GameSelectPage.tsx(373,52): error TS2345: Argument of type '"medium"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(374,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"medium"' have no overlap.
src/pages/GameSelectPage.tsx(380,52): error TS2345: Argument of type '"hard"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(381,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"hard"' have no overlap.
src/services/QuestionService.ts(127,27): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.
src/store/slices/gameSlice.ts(197,7): error TS2322: Type 'string' is not assignable to type 'number'.
  Type 'string' is not assignable to type 'number'.
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

src/components/enhanced/EnhancedButton.tsx(244,17): error TS1117: An object literal cannot have multiple properties with the same name.
src/hooks/useQuestions.ts(67,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/hooks/useQuestions.ts(68,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,20): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,48): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(146,19): error TS2322: Type '{ children: Element[]; glass: true; glassPreset: string; className: string; onClick: () => false | void; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/ExpandedGameSelectPage.tsx(201,25): error TS2322: Type 'string' is not assignable to type '"success" | "primary" | "secondary" | "danger" | "warning" | undefined'.
src/pages/ExpandedGameSelectPage.tsx(265,17): error TS2322: Type '{ children: Element; glass: true; glassPreset: string; className: string; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/GameSelectPage.tsx(217,14): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ easy: number[]; medium: number[]; hard: number[]; }'.
  No index signature with a parameter of type 'number' was found on type '{ easy: number[]; medium: number[]; hard: number[]; }'.
src/pages/GameSelectPage.tsx(243,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(244,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(366,52): error TS2345: Argument of type '"easy"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(367,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"easy"' have no overlap.
src/pages/GameSelectPage.tsx(373,52): error TS2345: Argument of type '"medium"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(374,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"medium"' have no overlap.
src/pages/GameSelectPage.tsx(380,52): error TS2345: Argument of type '"hard"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(381,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"hard"' have no overlap.
src/services/QuestionService.ts(127,27): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.
src/store/slices/gameSlice.ts(197,7): error TS2322: Type 'string' is not assignable to type 'number'.
  Type 'string' is not assignable to type 'number'.
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

src/components/enhanced/EnhancedButton.tsx(244,17): error TS1117: An object literal cannot have multiple properties with the same name.
src/hooks/useQuestions.ts(67,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/hooks/useQuestions.ts(68,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,20): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,48): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(146,19): error TS2322: Type '{ children: Element[]; glass: true; glassPreset: string; className: string; onClick: () => false | void; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/ExpandedGameSelectPage.tsx(201,25): error TS2322: Type 'string' is not assignable to type '"success" | "primary" | "secondary" | "danger" | "warning" | undefined'.
src/pages/ExpandedGameSelectPage.tsx(265,17): error TS2322: Type '{ children: Element; glass: true; glassPreset: string; className: string; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/GameSelectPage.tsx(217,14): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ easy: number[]; medium: number[]; hard: number[]; }'.
  No index signature with a parameter of type 'number' was found on type '{ easy: number[]; medium: number[]; hard: number[]; }'.
src/pages/GameSelectPage.tsx(243,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(244,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(366,52): error TS2345: Argument of type '"easy"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(367,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"easy"' have no overlap.
src/pages/GameSelectPage.tsx(373,52): error TS2345: Argument of type '"medium"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(374,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"medium"' have no overlap.
src/pages/GameSelectPage.tsx(380,52): error TS2345: Argument of type '"hard"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(381,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"hard"' have no overlap.
src/services/QuestionService.ts(127,27): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.
src/store/slices/gameSlice.ts(197,7): error TS2322: Type 'string' is not assignable to type 'number'.
  Type 'string' is not assignable to type 'number'.
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

src/components/enhanced/EnhancedButton.tsx(244,17): error TS1117: An object literal cannot have multiple properties with the same name.
src/hooks/useQuestions.ts(67,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/hooks/useQuestions.ts(68,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,20): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,48): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(146,19): error TS2322: Type '{ children: Element[]; glass: true; glassPreset: string; className: string; onClick: () => false | void; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/ExpandedGameSelectPage.tsx(201,25): error TS2322: Type 'string' is not assignable to type '"success" | "primary" | "secondary" | "danger" | "warning" | undefined'.
src/pages/ExpandedGameSelectPage.tsx(265,17): error TS2322: Type '{ children: Element; glass: true; glassPreset: string; className: string; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/GameSelectPage.tsx(217,14): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ easy: number[]; medium: number[]; hard: number[]; }'.
  No index signature with a parameter of type 'number' was found on type '{ easy: number[]; medium: number[]; hard: number[]; }'.
src/pages/GameSelectPage.tsx(243,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(244,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(366,52): error TS2345: Argument of type '"easy"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(367,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"easy"' have no overlap.
src/pages/GameSelectPage.tsx(373,52): error TS2345: Argument of type '"medium"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(374,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"medium"' have no overlap.
src/pages/GameSelectPage.tsx(380,52): error TS2345: Argument of type '"hard"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(381,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"hard"' have no overlap.
src/services/QuestionService.ts(127,27): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.
src/store/slices/gameSlice.ts(197,7): error TS2322: Type 'string' is not assignable to type 'number'.
  Type 'string' is not assignable to type 'number'.
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

src/components/enhanced/EnhancedButton.tsx(244,17): error TS1117: An object literal cannot have multiple properties with the same name.
src/hooks/useQuestions.ts(67,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/hooks/useQuestions.ts(68,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,20): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,48): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(146,19): error TS2322: Type '{ children: Element[]; glass: true; glassPreset: string; className: string; onClick: () => false | void; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/ExpandedGameSelectPage.tsx(201,25): error TS2322: Type 'string' is not assignable to type '"success" | "primary" | "secondary" | "danger" | "warning" | undefined'.
src/pages/ExpandedGameSelectPage.tsx(265,17): error TS2322: Type '{ children: Element; glass: true; glassPreset: string; className: string; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/GameSelectPage.tsx(217,14): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ easy: number[]; medium: number[]; hard: number[]; }'.
  No index signature with a parameter of type 'number' was found on type '{ easy: number[]; medium: number[]; hard: number[]; }'.
src/pages/GameSelectPage.tsx(243,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(244,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(366,52): error TS2345: Argument of type '"easy"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(367,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"easy"' have no overlap.
src/pages/GameSelectPage.tsx(373,52): error TS2345: Argument of type '"medium"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(374,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"medium"' have no overlap.
src/pages/GameSelectPage.tsx(380,52): error TS2345: Argument of type '"hard"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(381,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"hard"' have no overlap.
src/services/QuestionService.ts(127,27): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.
src/store/slices/gameSlice.ts(197,7): error TS2322: Type 'string' is not assignable to type 'number'.
  Type 'string' is not assignable to type 'number'.
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

src/components/enhanced/EnhancedButton.tsx(244,17): error TS1117: An object literal cannot have multiple properties with the same name.
src/hooks/useQuestions.ts(67,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/hooks/useQuestions.ts(68,5): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,20): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(43,48): error TS18048: 'profile.age' is possibly 'undefined'.
src/pages/ExpandedGameSelectPage.tsx(146,19): error TS2322: Type '{ children: Element[]; glass: true; glassPreset: string; className: string; onClick: () => false | void; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/ExpandedGameSelectPage.tsx(201,25): error TS2322: Type 'string' is not assignable to type '"success" | "primary" | "secondary" | "danger" | "warning" | undefined'.
src/pages/ExpandedGameSelectPage.tsx(265,17): error TS2322: Type '{ children: Element; glass: true; glassPreset: string; className: string; }' is not assignable to type 'IntrinsicAttributes & CardProps'.
  Property 'glass' does not exist on type 'IntrinsicAttributes & CardProps'.
src/pages/GameSelectPage.tsx(217,14): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ easy: number[]; medium: number[]; hard: number[]; }'.
  No index signature with a parameter of type 'number' was found on type '{ easy: number[]; medium: number[]; hard: number[]; }'.
src/pages/GameSelectPage.tsx(243,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(244,24): error TS7053: Element implicitly has an 'any' type because expression of type '"english" | "science" | "math" | "geography" | "arts" | "logic"' can't be used to index type '{ math: number; english: number; science: number; }'.
  Property 'geography' does not exist on type '{ math: number; english: number; science: number; }'.
src/pages/GameSelectPage.tsx(366,52): error TS2345: Argument of type '"easy"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(367,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"easy"' have no overlap.
src/pages/GameSelectPage.tsx(373,52): error TS2345: Argument of type '"medium"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(374,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"medium"' have no overlap.
src/pages/GameSelectPage.tsx(380,52): error TS2345: Argument of type '"hard"' is not assignable to parameter of type 'SetStateAction<number | "all">'.
src/pages/GameSelectPage.tsx(381,24): error TS2367: This comparison appears to be unintentional because the types 'number | "all"' and '"hard"' have no overlap.
src/services/QuestionService.ts(127,27): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.
src/store/slices/gameSlice.ts(197,7): error TS2322: Type 'string' is not assignable to type 'number'.
  Type 'string' is not assignable to type 'number'.
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2952 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-9u5QpacP.css                     [39m[1m[2m247.54 kB[22m[1m[22m[2m │ gzip:  35.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-CM2o_5CM.js       [39m[1m[2m  6.01 kB[22m[1m[22m[2m │ gzip:   2.45 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-BNYPphhm.js                    [39m[1m[2m 10.66 kB[22m[1m[22m[2m │ gzip:   4.07 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-V6MtDk-y.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-DkUnIbSV.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-g1eWtHE6.js            [39m[1m[2m 21.66 kB[22m[1m[22m[2m │ gzip:   4.19 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ExpandedGameSelectPage-aEIevj9S.js  [39m[1m[2m 23.83 kB[22m[1m[22m[2m │ gzip:   7.56 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-Dn8Bo43_.js         [39m[1m[2m 31.47 kB[22m[1m[22m[2m │ gzip:   9.08 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-BWVmQRTV.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-DS-9kPmW.js    [39m[1m[2m 97.08 kB[22m[1m[22m[2m │ gzip:  29.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-CUZwVlTg.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-Cyd_dWjC.js                   [39m[1m[2m296.25 kB[22m[1m[22m[2m │ gzip:  88.02 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 8.33s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m22 entries[39m [2m(1702.09 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2952 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-9u5QpacP.css                     [39m[1m[2m247.54 kB[22m[1m[22m[2m │ gzip:  35.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-CM2o_5CM.js       [39m[1m[2m  6.01 kB[22m[1m[22m[2m │ gzip:   2.45 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-BNYPphhm.js                    [39m[1m[2m 10.66 kB[22m[1m[22m[2m │ gzip:   4.07 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-V6MtDk-y.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-DkUnIbSV.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-g1eWtHE6.js            [39m[1m[2m 21.66 kB[22m[1m[22m[2m │ gzip:   4.19 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ExpandedGameSelectPage-aEIevj9S.js  [39m[1m[2m 23.83 kB[22m[1m[22m[2m │ gzip:   7.56 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-Dn8Bo43_.js         [39m[1m[2m 31.47 kB[22m[1m[22m[2m │ gzip:   9.08 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-BWVmQRTV.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-DS-9kPmW.js    [39m[1m[2m 97.08 kB[22m[1m[22m[2m │ gzip:  29.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-CUZwVlTg.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-Cyd_dWjC.js                   [39m[1m[2m296.25 kB[22m[1m[22m[2m │ gzip:  88.02 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 8.41s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m22 entries[39m [2m(1702.09 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2952 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-9u5QpacP.css                     [39m[1m[2m247.54 kB[22m[1m[22m[2m │ gzip:  35.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-CM2o_5CM.js       [39m[1m[2m  6.01 kB[22m[1m[22m[2m │ gzip:   2.45 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-BNYPphhm.js                    [39m[1m[2m 10.66 kB[22m[1m[22m[2m │ gzip:   4.07 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-V6MtDk-y.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-DkUnIbSV.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-g1eWtHE6.js            [39m[1m[2m 21.66 kB[22m[1m[22m[2m │ gzip:   4.19 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ExpandedGameSelectPage-aEIevj9S.js  [39m[1m[2m 23.83 kB[22m[1m[22m[2m │ gzip:   7.56 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-Dn8Bo43_.js         [39m[1m[2m 31.47 kB[22m[1m[22m[2m │ gzip:   9.08 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-BWVmQRTV.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-DS-9kPmW.js    [39m[1m[2m 97.08 kB[22m[1m[22m[2m │ gzip:  29.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-CUZwVlTg.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-Cyd_dWjC.js                   [39m[1m[2m296.25 kB[22m[1m[22m[2m │ gzip:  88.02 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 8.29s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m22 entries[39m [2m(1702.09 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2952 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.38 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-9u5QpacP.css                     [39m[1m[2m247.54 kB[22m[1m[22m[2m │ gzip:  35.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-CM2o_5CM.js       [39m[1m[2m  6.01 kB[22m[1m[22m[2m │ gzip:   2.45 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-BNYPphhm.js                    [39m[1m[2m 10.66 kB[22m[1m[22m[2m │ gzip:   4.07 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-V6MtDk-y.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-DkUnIbSV.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-g1eWtHE6.js            [39m[1m[2m 21.66 kB[22m[1m[22m[2m │ gzip:   4.19 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ExpandedGameSelectPage-aEIevj9S.js  [39m[1m[2m 23.83 kB[22m[1m[22m[2m │ gzip:   7.56 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-Dn8Bo43_.js         [39m[1m[2m 31.47 kB[22m[1m[22m[2m │ gzip:   9.08 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-BWVmQRTV.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-DS-9kPmW.js    [39m[1m[2m 97.08 kB[22m[1m[22m[2m │ gzip:  29.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-CUZwVlTg.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-Cyd_dWjC.js                   [39m[1m[2m296.25 kB[22m[1m[22m[2m │ gzip:  88.02 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 8.17s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m22 entries[39m [2m(1702.09 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

src/components/dashboard/CelebrationSettings.tsx(47,54): error TS2339: Property 'parent' does not exist on type '{ student: StudentState & PersistPartial; session: SessionState; game: GameSliceState; settings: SettingsState & PersistPartial; analytics: AnalyticsState & PersistPartial; adaptive: AdaptiveState; }'.
src/components/dashboard/CelebrationSettings.tsx(128,34): error TS7006: Parameter 'c' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(223,26): error TS7006: Parameter 'child' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(498,14): error TS2322: Type '{ children: string; jsx: true; }' is not assignable to type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
  Property 'jsx' does not exist on type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
src/pages/EnhancedGamePlayPage.tsx(338,9): error TS2345: Argument of type 'string | string[]' is not assignable to parameter of type 'string'.
  Type 'string[]' is not assignable to type 'string'.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2687: All declarations of 'SpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2717: Subsequent property declarations must have the same type.  Property 'SpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2687: All declarations of 'webkitSpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2717: Subsequent property declarations must have the same type.  Property 'webkitSpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/cloud/CloudSyncService.ts(8,10): error TS2724: '"../security/UltraEncryptionService"' has no exported member named 'UltraEncryptionService'. Did you mean 'ultraEncryption'?
src/services/cloud/CloudSyncService.ts(74,3): error TS7008: Member 'isS' implicitly has an 'any' type.
src/services/cloud/CloudSyncService.ts(133,7): error TS2561: Object literal may only specify known properties, but 'isSyncing' does not exist in type 'SyncStatus'. Did you mean to write 'yncing'?
src/services/cloud/CloudSyncService.ts(272,25): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(276,21): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(326,23): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/feedback/QuickFeedbackEngine.ts(101,12): error TS2339: Property 'style' does not exist on type 'Element'.
src/services/feedback/QuickFeedbackEngine.ts(110,26): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(172,29): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(176,28): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(185,25): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(338,27): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/gamification/DailyChallengesService.ts(509,42): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/gamification/DailyChallengesService.ts(511,37): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/multiplayer/MultiplayerService.ts(869,23): error TS18046: 'b' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(869,30): error TS18046: 'a' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(872,19): error TS18046: 'entry' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(873,16): error TS18046: 'entry' is of type 'unknown'.
src/services/pwa/service-worker.ts(136,7): error TS2322: Type 'Response | undefined' is not assignable to type 'Response'.
  Type 'undefined' is not assignable to type 'Response'.
src/services/pwa/service-worker.ts(317,5): error TS2353: Object literal may only specify known properties, and 'vibrate' does not exist in type 'NotificationOptions'.
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

src/components/dashboard/CelebrationSettings.tsx(47,54): error TS2339: Property 'parent' does not exist on type '{ student: StudentState & PersistPartial; session: SessionState; game: GameSliceState; settings: SettingsState & PersistPartial; analytics: AnalyticsState & PersistPartial; adaptive: AdaptiveState; }'.
src/components/dashboard/CelebrationSettings.tsx(128,34): error TS7006: Parameter 'c' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(223,26): error TS7006: Parameter 'child' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(498,14): error TS2322: Type '{ children: string; jsx: true; }' is not assignable to type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
  Property 'jsx' does not exist on type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
src/pages/EnhancedGamePlayPage.tsx(338,9): error TS2345: Argument of type 'string | string[]' is not assignable to parameter of type 'string'.
  Type 'string[]' is not assignable to type 'string'.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2687: All declarations of 'SpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2717: Subsequent property declarations must have the same type.  Property 'SpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2687: All declarations of 'webkitSpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2717: Subsequent property declarations must have the same type.  Property 'webkitSpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/cloud/CloudSyncService.ts(8,10): error TS2724: '"../security/UltraEncryptionService"' has no exported member named 'UltraEncryptionService'. Did you mean 'ultraEncryption'?
src/services/cloud/CloudSyncService.ts(74,3): error TS7008: Member 'isS' implicitly has an 'any' type.
src/services/cloud/CloudSyncService.ts(133,7): error TS2561: Object literal may only specify known properties, but 'isSyncing' does not exist in type 'SyncStatus'. Did you mean to write 'yncing'?
src/services/cloud/CloudSyncService.ts(272,25): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(276,21): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(326,23): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/feedback/QuickFeedbackEngine.ts(101,12): error TS2339: Property 'style' does not exist on type 'Element'.
src/services/feedback/QuickFeedbackEngine.ts(110,26): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(172,29): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(176,28): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(185,25): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(338,27): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/gamification/DailyChallengesService.ts(509,42): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/gamification/DailyChallengesService.ts(511,37): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/multiplayer/MultiplayerService.ts(869,23): error TS18046: 'b' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(869,30): error TS18046: 'a' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(872,19): error TS18046: 'entry' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(873,16): error TS18046: 'entry' is of type 'unknown'.
src/services/pwa/service-worker.ts(136,7): error TS2322: Type 'Response | undefined' is not assignable to type 'Response'.
  Type 'undefined' is not assignable to type 'Response'.
src/services/pwa/service-worker.ts(317,5): error TS2353: Object literal may only specify known properties, and 'vibrate' does not exist in type 'NotificationOptions'.
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

src/components/dashboard/CelebrationSettings.tsx(47,54): error TS2339: Property 'parent' does not exist on type '{ student: StudentState & PersistPartial; session: SessionState; game: GameSliceState; settings: SettingsState & PersistPartial; analytics: AnalyticsState & PersistPartial; adaptive: AdaptiveState; }'.
src/components/dashboard/CelebrationSettings.tsx(128,34): error TS7006: Parameter 'c' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(223,26): error TS7006: Parameter 'child' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(498,14): error TS2322: Type '{ children: string; jsx: true; }' is not assignable to type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
  Property 'jsx' does not exist on type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
src/pages/EnhancedGamePlayPage.tsx(338,9): error TS2345: Argument of type 'string | string[]' is not assignable to parameter of type 'string'.
  Type 'string[]' is not assignable to type 'string'.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2687: All declarations of 'SpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2717: Subsequent property declarations must have the same type.  Property 'SpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2687: All declarations of 'webkitSpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2717: Subsequent property declarations must have the same type.  Property 'webkitSpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/cloud/CloudSyncService.ts(8,10): error TS2724: '"../security/UltraEncryptionService"' has no exported member named 'UltraEncryptionService'. Did you mean 'ultraEncryption'?
src/services/cloud/CloudSyncService.ts(74,3): error TS7008: Member 'isS' implicitly has an 'any' type.
src/services/cloud/CloudSyncService.ts(133,7): error TS2561: Object literal may only specify known properties, but 'isSyncing' does not exist in type 'SyncStatus'. Did you mean to write 'yncing'?
src/services/cloud/CloudSyncService.ts(272,25): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(276,21): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(326,23): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/feedback/QuickFeedbackEngine.ts(101,12): error TS2339: Property 'style' does not exist on type 'Element'.
src/services/feedback/QuickFeedbackEngine.ts(110,26): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(172,29): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(176,28): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(185,25): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(338,27): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/gamification/DailyChallengesService.ts(509,42): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/gamification/DailyChallengesService.ts(511,37): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/multiplayer/MultiplayerService.ts(869,23): error TS18046: 'b' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(869,30): error TS18046: 'a' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(872,19): error TS18046: 'entry' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(873,16): error TS18046: 'entry' is of type 'unknown'.
src/services/pwa/service-worker.ts(136,7): error TS2322: Type 'Response | undefined' is not assignable to type 'Response'.
  Type 'undefined' is not assignable to type 'Response'.
src/services/pwa/service-worker.ts(317,5): error TS2353: Object literal may only specify known properties, and 'vibrate' does not exist in type 'NotificationOptions'.
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

src/components/dashboard/CelebrationSettings.tsx(47,54): error TS2339: Property 'parent' does not exist on type '{ student: StudentState & PersistPartial; session: SessionState; game: GameSliceState; settings: SettingsState & PersistPartial; analytics: AnalyticsState & PersistPartial; adaptive: AdaptiveState; }'.
src/components/dashboard/CelebrationSettings.tsx(128,34): error TS7006: Parameter 'c' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(223,26): error TS7006: Parameter 'child' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(498,14): error TS2322: Type '{ children: string; jsx: true; }' is not assignable to type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
  Property 'jsx' does not exist on type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
src/pages/EnhancedGamePlayPage.tsx(338,9): error TS2345: Argument of type 'string | string[]' is not assignable to parameter of type 'string'.
  Type 'string[]' is not assignable to type 'string'.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2687: All declarations of 'SpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2717: Subsequent property declarations must have the same type.  Property 'SpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2687: All declarations of 'webkitSpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2717: Subsequent property declarations must have the same type.  Property 'webkitSpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/cloud/CloudSyncService.ts(8,10): error TS2724: '"../security/UltraEncryptionService"' has no exported member named 'UltraEncryptionService'. Did you mean 'ultraEncryption'?
src/services/cloud/CloudSyncService.ts(74,3): error TS7008: Member 'isS' implicitly has an 'any' type.
src/services/cloud/CloudSyncService.ts(133,7): error TS2561: Object literal may only specify known properties, but 'isSyncing' does not exist in type 'SyncStatus'. Did you mean to write 'yncing'?
src/services/cloud/CloudSyncService.ts(272,25): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(276,21): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(326,23): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/feedback/QuickFeedbackEngine.ts(101,12): error TS2339: Property 'style' does not exist on type 'Element'.
src/services/feedback/QuickFeedbackEngine.ts(110,26): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(172,29): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(176,28): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(185,25): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(338,27): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/gamification/DailyChallengesService.ts(509,42): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/gamification/DailyChallengesService.ts(511,37): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/multiplayer/MultiplayerService.ts(869,23): error TS18046: 'b' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(869,30): error TS18046: 'a' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(872,19): error TS18046: 'entry' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(873,16): error TS18046: 'entry' is of type 'unknown'.
src/services/pwa/service-worker.ts(136,7): error TS2322: Type 'Response | undefined' is not assignable to type 'Response'.
  Type 'undefined' is not assignable to type 'Response'.
src/services/pwa/service-worker.ts(317,5): error TS2353: Object literal may only specify known properties, and 'vibrate' does not exist in type 'NotificationOptions'.
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

src/components/dashboard/CelebrationSettings.tsx(47,54): error TS2339: Property 'parent' does not exist on type '{ student: StudentState & PersistPartial; session: SessionState; game: GameSliceState; settings: SettingsState & PersistPartial; analytics: AnalyticsState & PersistPartial; adaptive: AdaptiveState; }'.
src/components/dashboard/CelebrationSettings.tsx(128,34): error TS7006: Parameter 'c' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(223,26): error TS7006: Parameter 'child' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(498,14): error TS2322: Type '{ children: string; jsx: true; }' is not assignable to type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
  Property 'jsx' does not exist on type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
src/pages/EnhancedGamePlayPage.tsx(338,9): error TS2345: Argument of type 'string | string[]' is not assignable to parameter of type 'string'.
  Type 'string[]' is not assignable to type 'string'.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2687: All declarations of 'SpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2717: Subsequent property declarations must have the same type.  Property 'SpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2687: All declarations of 'webkitSpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2717: Subsequent property declarations must have the same type.  Property 'webkitSpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/cloud/CloudSyncService.ts(8,10): error TS2724: '"../security/UltraEncryptionService"' has no exported member named 'UltraEncryptionService'. Did you mean 'ultraEncryption'?
src/services/cloud/CloudSyncService.ts(74,3): error TS7008: Member 'isS' implicitly has an 'any' type.
src/services/cloud/CloudSyncService.ts(133,7): error TS2561: Object literal may only specify known properties, but 'isSyncing' does not exist in type 'SyncStatus'. Did you mean to write 'yncing'?
src/services/cloud/CloudSyncService.ts(272,25): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(276,21): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(326,23): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/feedback/QuickFeedbackEngine.ts(101,12): error TS2339: Property 'style' does not exist on type 'Element'.
src/services/feedback/QuickFeedbackEngine.ts(110,26): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(172,29): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(176,28): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(185,25): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(338,27): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/gamification/DailyChallengesService.ts(509,42): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/gamification/DailyChallengesService.ts(511,37): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/multiplayer/MultiplayerService.ts(869,23): error TS18046: 'b' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(869,30): error TS18046: 'a' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(872,19): error TS18046: 'entry' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(873,16): error TS18046: 'entry' is of type 'unknown'.
src/services/pwa/service-worker.ts(136,7): error TS2322: Type 'Response | undefined' is not assignable to type 'Response'.
  Type 'undefined' is not assignable to type 'Response'.
src/services/pwa/service-worker.ts(317,5): error TS2353: Object literal may only specify known properties, and 'vibrate' does not exist in type 'NotificationOptions'.
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

src/components/dashboard/CelebrationSettings.tsx(47,54): error TS2339: Property 'parent' does not exist on type '{ student: StudentState & PersistPartial; session: SessionState; game: GameSliceState; settings: SettingsState & PersistPartial; analytics: AnalyticsState & PersistPartial; adaptive: AdaptiveState; }'.
src/components/dashboard/CelebrationSettings.tsx(128,34): error TS7006: Parameter 'c' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(223,26): error TS7006: Parameter 'child' implicitly has an 'any' type.
src/components/dashboard/CelebrationSettings.tsx(498,14): error TS2322: Type '{ children: string; jsx: true; }' is not assignable to type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
  Property 'jsx' does not exist on type 'DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>'.
src/pages/EnhancedGamePlayPage.tsx(338,9): error TS2345: Argument of type 'string | string[]' is not assignable to parameter of type 'string'.
  Type 'string[]' is not assignable to type 'string'.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2687: All declarations of 'SpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(65,5): error TS2717: Subsequent property declarations must have the same type.  Property 'SpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2687: All declarations of 'webkitSpeechRecognition' must have identical modifiers.
src/services/accessibility/VoiceInteractionService.ts(66,5): error TS2717: Subsequent property declarations must have the same type.  Property 'webkitSpeechRecognition' must be of type 'SpeechRecognitionConstructor | undefined', but here has type 'any'.
src/services/cloud/CloudSyncService.ts(8,10): error TS2724: '"../security/UltraEncryptionService"' has no exported member named 'UltraEncryptionService'. Did you mean 'ultraEncryption'?
src/services/cloud/CloudSyncService.ts(74,3): error TS7008: Member 'isS' implicitly has an 'any' type.
src/services/cloud/CloudSyncService.ts(133,7): error TS2561: Object literal may only specify known properties, but 'isSyncing' does not exist in type 'SyncStatus'. Did you mean to write 'yncing'?
src/services/cloud/CloudSyncService.ts(272,25): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(276,21): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/cloud/CloudSyncService.ts(326,23): error TS2551: Property 'isSyncing' does not exist on type 'SyncStatus'. Did you mean 'yncing'?
src/services/feedback/QuickFeedbackEngine.ts(101,12): error TS2339: Property 'style' does not exist on type 'Element'.
src/services/feedback/QuickFeedbackEngine.ts(110,26): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(172,29): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(176,28): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(185,25): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/feedback/QuickFeedbackEngine.ts(338,27): error TS2345: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
  Type 'Element' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, autocorrect, and 130 more.
src/services/gamification/DailyChallengesService.ts(509,42): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/gamification/DailyChallengesService.ts(511,37): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/services/multiplayer/MultiplayerService.ts(869,23): error TS18046: 'b' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(869,30): error TS18046: 'a' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(872,19): error TS18046: 'entry' is of type 'unknown'.
src/services/multiplayer/MultiplayerService.ts(873,16): error TS18046: 'entry' is of type 'unknown'.
src/services/pwa/service-worker.ts(136,7): error TS2322: Type 'Response | undefined' is not assignable to type 'Response'.
  Type 'undefined' is not assignable to type 'Response'.
src/services/pwa/service-worker.ts(317,5): error TS2353: Object literal may only specify known properties, and 'vibrate' does not exist in type 'NotificationOptions'.
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2955 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.39 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-CLdw1GuC.css                     [39m[1m[2m249.70 kB[22m[1m[22m[2m │ gzip:  35.93 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-Cp7kkLWv.js       [39m[1m[2m  6.01 kB[22m[1m[22m[2m │ gzip:   2.45 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-COdbq_so.js                    [39m[1m[2m 10.66 kB[22m[1m[22m[2m │ gzip:   4.07 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-CMo4MRiS.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-PQNTi_qG.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-BPpI3jSu.js            [39m[1m[2m 21.66 kB[22m[1m[22m[2m │ gzip:   4.19 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ExpandedGameSelectPage-znfLmQ3z.js  [39m[1m[2m 23.88 kB[22m[1m[22m[2m │ gzip:   7.58 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-BY1gLlRi.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/QuickFeedbackEngine-CnJCNZqX.js     [39m[1m[2m 40.29 kB[22m[1m[22m[2m │ gzip:   9.34 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-BuPhMz1J.js         [39m[1m[2m 41.56 kB[22m[1m[22m[2m │ gzip:  11.51 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-D3s4CNev.js    [39m[1m[2m 97.91 kB[22m[1m[22m[2m │ gzip:  29.83 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-Dsz1BJYE.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-BLwQuI2N.js                   [39m[1m[2m296.30 kB[22m[1m[22m[2m │ gzip:  88.06 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 8.50s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m23 entries[39m [2m(1754.52 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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

[33mbuild.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".[39m
[36mvite v5.4.20 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2955 modules transformed.
rendering chunks...
[1m[33m[plugin:vite:reporter][39m[22m [33m[plugin vite:reporter] 
(!) /home/runner/work/stealth-learning/stealth-learning/src/store/slices/studentSlice.ts is dynamically imported by /home/runner/work/stealth-learning/stealth-learning/src/App.tsx but also statically imported by /home/runner/work/stealth-learning/stealth-learning/src/components/Layout.tsx, /home/runner/work/stealth-learning/stealth-learning/src/components/SessionTimer.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/ProfilePage.tsx, /home/runner/work/stealth-learning/stealth-learning/src/pages/UltraKidsLandingSimple.tsx, /home/runner/work/stealth-learning/stealth-learning/src/store/index.ts, dynamic import will not move module into another chunk.
[39m
computing gzip size...
[2mdist/[22m[32mregisterSW.js                                 [39m[1m[2m  0.17 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.json                                 [39m[1m[2m  0.59 kB[22m[1m[22m[2m │ gzip:   0.30 kB[22m
[2mdist/[22m[32mindex.html                                    [39m[1m[2m  7.28 kB[22m[1m[22m[2m │ gzip:   2.39 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-CLdw1GuC.css                     [39m[1m[2m249.70 kB[22m[1m[22m[2m │ gzip:  35.93 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ToastNotification-Cp7kkLWv.js       [39m[1m[2m  6.01 kB[22m[1m[22m[2m │ gzip:   2.45 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Card-COdbq_so.js                    [39m[1m[2m 10.66 kB[22m[1m[22m[2m │ gzip:   4.07 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/AuthenticationService-CMo4MRiS.js   [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ gzip:   3.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProfilePage-PQNTi_qG.js             [39m[1m[2m 15.94 kB[22m[1m[22m[2m │ gzip:   4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsPage-BPpI3jSu.js            [39m[1m[2m 21.66 kB[22m[1m[22m[2m │ gzip:   4.19 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ExpandedGameSelectPage-znfLmQ3z.js  [39m[1m[2m 23.88 kB[22m[1m[22m[2m │ gzip:   7.58 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/redux-vendor--TX21DhT.js            [39m[1m[2m 27.87 kB[22m[1m[22m[2m │ gzip:  10.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ProgressPage-BY1gLlRi.js            [39m[1m[2m 38.71 kB[22m[1m[22m[2m │ gzip:   9.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/QuickFeedbackEngine-CnJCNZqX.js     [39m[1m[2m 40.29 kB[22m[1m[22m[2m │ gzip:   9.34 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ParentDashboard-BuPhMz1J.js         [39m[1m[2m 41.56 kB[22m[1m[22m[2m │ gzip:  11.51 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/game-vendor-Dw0mPGd_.js             [39m[1m[2m 47.78 kB[22m[1m[22m[2m │ gzip:  14.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/crypto-vendor-DBXp-go_.js           [39m[1m[2m 69.94 kB[22m[1m[22m[2m │ gzip:  26.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedGamePlayPage-D3s4CNev.js    [39m[1m[2m 97.91 kB[22m[1m[22m[2m │ gzip:  29.83 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DwJzIzJi.js               [39m[1m[2m105.60 kB[22m[1m[22m[2m │ gzip:  35.76 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatabaseService-Dsz1BJYE.js         [39m[1m[2m117.29 kB[22m[1m[22m[2m │ gzip:  37.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BqsuP7LV.js            [39m[1m[2m163.33 kB[22m[1m[22m[2m │ gzip:  53.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-BLwQuI2N.js                   [39m[1m[2m296.30 kB[22m[1m[22m[2m │ gzip:  88.06 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PieChart-CU0g9g_k.js                [39m[1m[2m399.72 kB[22m[1m[22m[2m │ gzip: 108.22 kB[22m
[32m✓ built in 8.35s[39m

[36mPWA v0.17.5[39m
mode      [35mgenerateSW[39m
precache  [32m23 entries[39m [2m(1754.52 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/workbox-6c5b4cd0.js[22m
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
