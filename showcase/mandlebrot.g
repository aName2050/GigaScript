const MAX_SIZE = 100;

func mandlebrot(c) {
    let z = { x: 0, y: 0 };
    let n = 0;
    let p;
    let d;

    while(d <= 2 && n < MAX_SIZE) {
        p = {
            x: math.pow(z.x, 2) - math.pow(z.y, 2),
            y: 2 * z.x * z.y
        }
        z = {
            x: p.x + c.x,
            y: p.y + c.y
        }
        d = math.sqrt(math.pow(z.x, 2) + math.pow(z.y, 2))
        n += 1
    }

    const d2 = d <= 2;

    return [n, d2];
}
