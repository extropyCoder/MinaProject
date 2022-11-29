# MinaProject
# Shamir Secret Sharing

## Concept 
A process to split a secret (such as a private key into a number of shares, a subset of which can be later combined to recreate the original secret.

Based on the fact the $k$ points are required to define a polynomial of degree $k-1$
With our points being elements in a finite field $\mathbb{F}$ of size $P$ where $0 < k le n < P; S<P$ and $P$ is a prime number.

## Process

### Create Shares 

Choose at random $k-1$ positive integers $a_1 .. a_{k-1}$ with $a_i <P$  and let $a_0 = S$ 

The person splitting the secret builds a polynomial where the secret is the constant term $a_0$ 

$f(x)=a_0 + a_1x + a_2x^2 + ... + a_{k-1}x^{k-1}$

Let us construct any $n$ points out of it, for instance set $i=1..n$ to retrieve $(i,f(i))$ .

Every participant is given a point

## Retrieving the secret

Given any subset of $k$ of these points, we can find the coefficients of the polynomial using interpolation. 
The secret is the constant term $a_0$

For example 

$x^4 + 3x^3 + 4x + 12$ 

<img width="351" alt="Screenshot 2022-11-29 at 14 16 29" src="https://user-images.githubusercontent.com/15907736/204574286-ce0e7ca7-b37b-40b5-91ac-dddb8dbe229e.png">

