precision highp float;
struct DirectionalLight
{
	vec3 direction;
	vec3 color;
};
uniform int uMode;
uniform sampler2D uSampler1;
uniform vec3 uEyePos;
uniform DirectionalLight sun;
vec3 ambientLight = vec3(0.2, 0.2, 0.2);
uniform vec4 uColor;
varying vec2 fTexUV;
varying vec3 fNormal;
varying vec3 fPos;
void main(){
    if(uMode == 1){
		vec3 toLightNormal = normalize(uEyePos - fPos);
		vec4 texel = texture2D(uSampler1, fTexUV);		
		float lightIntensity = 0.4 + max(dot(fNormal, toLightNormal), 0.0);
		gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
    }else{
        gl_FragColor = uColor;
    }
}