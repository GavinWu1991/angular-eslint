import type { TSESTree } from '@typescript-eslint/experimental-utils';
import { createESLintRule } from '../utils/create-eslint-rule';
import {
  COMPONENT_OR_DIRECTIVE_CLASS_DECORATOR,
  INPUTS_METADATA_PROPERTY,
} from '../utils/selectors';

type Options = [];
export type MessageIds = 'noInputsMetadataProperty';
export const RULE_NAME = 'no-inputs-metadata-property';
const METADATA_PROPERTY_NAME = 'inputs';
const STYLE_GUIDE_LINK = 'https://angular.io/styleguide#style-05-12';

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: `Disallows usage of the \`${METADATA_PROPERTY_NAME}\` metadata property. See more at ${STYLE_GUIDE_LINK}`,
      category: 'Best Practices',
      recommended: 'error',
    },
    schema: [],
    messages: {
      noInputsMetadataProperty: `Use \`@Input\` rather than the \`${METADATA_PROPERTY_NAME}\` metadata property (${STYLE_GUIDE_LINK})`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      [`${COMPONENT_OR_DIRECTIVE_CLASS_DECORATOR} ${INPUTS_METADATA_PROPERTY}[computed=false]`](
        node: TSESTree.PropertyNonComputedName,
      ) {
        context.report({
          node,
          messageId: 'noInputsMetadataProperty',
        });
      },
    };
  },
});
