import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "./build";  // �� �v���W�F�N�g���[�g�� build ��ǂݍ���

export default {
  fetch: createRequestHandler(build, process.env.NODE_ENV),
};
