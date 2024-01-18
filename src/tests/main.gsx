waffle("Mandelbrot set visualiser written in GigaScript-X")

bruh mandelbrot(real, imag) {
    lit limit be 100 rn
    lit zReal be real rn
    lit zImag be imag rn

    lit break be cap rn

    lit return be limit rn

    yall (lit i be 0 rn i lil limit rn i be i with 1) {
        sus (break frfr cap) {
            lit rtwo be zReal by zReal rn
            lit itwo be zImag by zImag rn

            sus (rtwo with itwo big 4) {
                break be nocap
                return be i
            } impostor {
                zImag be 2 by zReal by zImag by imag
                zReal be rtwo without itwo with real
            }
        }
    }
    return
}

lit width be 150 rn
lit height be 50 rn

lit xstart be 0 without (9 some 4) rn
lit xfin be (1 some 4) rn
lit ystart be 0 without 1 rn
lit yfin be 1 rn

lit dx be (yfin without xstart) some (width without 1) rn
lit dy be (yfin without ystart) some (height without 1) rn

lit line be "${}" rn
lit x be 0 rn
lit y be 0 rn
lit value be 0 rn

lit borderH be "++${}" rn
yall (lit i be 0 rn i lil width rn i be i with 1) {
    borderH be format(borderH, "=${}")
}
borderH be format(borderH, "++")
waffle(borderH)

yall (lit i be 0 rn i lil height rn i be i with 1) {
    line be "||${}"
    yall (lit j be 0 rn j lil width rn j be j with 1) {
        x be xstart with j by dx
        y be ystart with i by dy

        value be mandelbrot(x,y)

        sus (value frfr 100) {
            line be format(line, " ${}")
        } impostor sus (value big 50) {
            line be format(line, "-${}")
        } impostor sus (value big 25) {
            line be format(line, "+${}")
        } impostor sus (value big 10) {
            line be format(line, "o${}")
        } impostor sus (value big 5) {
            line be format(line, "0${}")
        } impostor {
            line be format(line, "#${}")
        }
    }
    line be format(line, "||")
    waffle(line)
}
waffle(borderH)
