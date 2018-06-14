const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';



export default {
  pyEnvPath: '/root/.virtualenvs/cv/bin/python',
  pyScriptPath: 'py_face_morph/',
  port: env.PORT || 8080,
  host: env.HOST || '0.0.0.0',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  }
};
