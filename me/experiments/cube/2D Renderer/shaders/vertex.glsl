#version 300 es
precision mediump float;

in vec2 a_position;
in vec2 a_uv;
out vec2 f_uv;

uniform mat3 u_matrix[5];

void main() {
    f_uv = a_uv;
    
    gl_Position = vec4((u_matrix[0] * u_matrix[1] * u_matrix[2] * u_matrix[3] * u_matrix[4] * vec3(a_position, 1.0)).xy, 0, 1);
}
