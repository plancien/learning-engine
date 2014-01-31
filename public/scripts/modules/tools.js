define(function() {

    var tools = {

        /***************************************************************************************************
         *** VECTORS UTILS
         ***************************************************************************************************/
        vectors: {
            /***************************************************************************************************
             ***  DESCRIPTION => return the vecotrs sum
             ***  INPUT       => { x : <float>, y : <float> } *2
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            add: function(vA, vB) {
                return {
                    "x": vA.x + vB.x,
                    "y": vA.y + vB.y
                };
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the substracted vectors
             ***  INPUT       => { x : <float>, y : <float> } *2
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            sub: function(vA, vB) {
                return {
                    "x": vA.x - vB.x,
                    "y": vA.y - vB.y
                };
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the multiplied vector
             ***  INPUT       => { x : <float>, y : <float> }, <float> m
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            mult: function(vA, m) {
                return {
                    "x": vA.x * m,
                    "y": vA.y * m
                };
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the vector's magnitude
             ***  INPUT       => { x : <float>, y : <float> }
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            magnitude: function(vA) {
                return Math.sqrt(vA.x * vA.x + vA.y * vA.y);
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the divided vector
             ***  INPUT       => { x : <float>, y : <float> }, <float> m
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            div: function(vA, m) {
                return {
                    "x": vA.x / m,
                    "y": vA.y / m
                };
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the limited vector
             ***  INPUT       => { x : <float>, y : <float> }, <float> max
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            limit: function(vA, max) {
                if (this.magnitude(vA) > max) {
                    vA = this.normalize(vA);
                    return this.mult(vA, max);
                } else return vA;
            },

            /***************************************************************************************************
             ***  DESCRIPTION => get the normalized vector
             ***  INPUT       => { x : <float>, y : <float> }
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            normalize: function(vA) {
                var m = this.magnitude(vA);
                return this.div(vA, m);
            },

            /***************************************************************************************************
             ***  DESCRIPTION => get the distance between 2 positions
             ***  INPUT       => { x : <float>, y : <float> } x2
             ***  OUTPUT      => float
             ***************************************************************************************************/
            getDistance: function(pos1, pos2) {
                var distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
                return distance;
            },

            /***************************************************************************************************
             ***  DESCRIPTION => get the angle between 2 positions
             ***  INPUT       => { x : <float>, y : <float> } x2, string ("degree" or "radian")
             ***  OUTPUT      => float
             ***************************************************************************************************/
            getAngle: function(pos1, pos2, angleType) {
                var angleRad = Math.atan2(pos1.x - pos2.x, pos1.y - pos2.y) - Math.PI / 2;
                var angleDeg = angleRad * 180 / Math.PI;

                if (angleType === "degree") {
                    return -angleDeg;
                } else {
                    return -angleRad;
                }
            }
        },

        random: {
            perlin: function() {
                var perlin = {
                    /***************************************************************************************************
                     ***  DON'T TOUCH
                     ***************************************************************************************************/
                    p: new Array(512),
                    /***************************************************************************************************
                     ***  DON'T TOUCH
                     ***************************************************************************************************/
                    permutation: [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180],
                    /***************************************************************************************************
                     ***  DESCRIPTION => generate a random value with 3 seeds
                     ***  INPUT       => <float> *3
                     ***  OUTPUT      => float
                     ***************************************************************************************************/
                    noise: function(x, y, z) {
                        var X = Math.floor(x) & 255,
                            // FIND UNIT CUBE THAT
                            Y = Math.floor(y) & 255,
                            // CONTAINS POINT.
                            Z = Math.floor(z) & 255;
                        x -= Math.floor(x); // FIND RELATIVE X,Y,Z
                        y -= Math.floor(y); // OF POINT IN CUBE.
                        z -= Math.floor(z);
                        var u = tools.maths.fade(x),
                            // COMPUTE FADE CURVES
                            v = tools.maths.fade(y),
                            // FOR EACH OF X,Y,Z.
                            w = tools.maths.fade(z);
                        var A = this.p[X] + Y,
                            AA = this.p[A] + Z,
                            AB = this.p[A + 1] + Z,
                            // HASH COORDINATES OF
                            B = this.p[X + 1] + Y,
                            BA = this.p[B] + Z,
                            BB = this.p[B + 1] + Z; // THE 8 CUBE CORNERS,
                        return tools.maths.scale(tools.maths.lerp(w, tools.maths.lerp(v, tools.maths.lerp(u, tools.maths.grad(this.p[AA], x, y, z), // AND ADD
                        tools.maths.grad(this.p[BA], x - 1, y, z)), // BLENDED
                        tools.maths.lerp(u, tools.maths.grad(this.p[AB], x, y - 1, z), // RESULTS
                        tools.maths.grad(this.p[BB], x - 1, y - 1, z))), // FROM  8
                        tools.maths.lerp(v, tools.maths.lerp(u, tools.maths.grad(this.p[AA + 1], x, y, z - 1), // CORNERS
                        tools.maths.grad(this.p[BA + 1], x - 1, y, z - 1)), // OF CUBE
                        tools.maths.lerp(u, tools.maths.grad(this.p[AB + 1], x, y - 1, z - 1), tools.maths.grad(this.p[BB + 1], x - 1, y - 1, z - 1)))));
                    },
                    /***************************************************************************************************
                     ***  DESCRIPTION => generate a random value with 3 seeds and an octave value which define the number of generations
                     ***  INPUT       => <float> *4
                     ***  OUTPUT      => float
                     ***************************************************************************************************/
                    turbulence: function(x, y, z, octaves) {
                        var t = 0;
                        var f = 1;
                        var n = 0;

                        for (var i = 0; i < octaves; i++, f *= 2) {
                            n += this.noise(x * f, y * f, z) / f;
                            t += 1 / f;
                        }
                        return n / t;
                    }
                };
                for (var i = 0; i < 256; i++)
                perlin.p[256 + i] = perlin.p[i] = perlin.permutation[i];
                return perlin;
            }()
        },

        /***************************************************************************************************
         ***  Brace yourself, MATHS ARE COMMING
         ***************************************************************************************************/
        maths: {
            map_range: function(value, low1, high1, low2, high2) {
                return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
            },

            bias: function(a, b) {
                return Math.pow(a, Math.log(b) / Math.log(0.5));
            },

            fade: function(t) {
                return t * t * t * (t * (t * 6 - 15) + 10);
            },

            lerp: function(t, a, b) {
                return a + t * (b - a);
            },

            grad: function(hash, x, y, z) {
                var h = hash & 15;
                var u = h < 8 ? x : y,
                    v = h < 4 ? y : h == 12 || h == 14 ? x : z;
                return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
            },

            scale: function(n) {
                return (1 + n) / 2;
            }
        }
    };

    return tools;
});
