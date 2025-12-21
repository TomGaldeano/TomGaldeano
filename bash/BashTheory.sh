#!/bin/bash

# Basic examples and notes for Bash scripting

echo "Hello World"

## Read input into variables
echo "What is your name?"
read -r name
echo "hello $name"

echo "What is your age?"
read -r age
echo "you are $age years old"

## Arrays
transport=("car" "train" "bike" "bus")
echo "All transport: ${transport[*]}"
unset 'transport[0]'
echo "After unset: ${transport[*]}"
transport[0]='coche'
echo "First element now: ${transport[0]}"

## If statement and file tests (fixed variable assignment)
filename="hello.txt"
if [ -f "$filename" ] && [ -w "$filename" ]; then
    echo "Hello world" >> "$filename"
else
    echo "Hello" > "$filename"
fi

## Numeric comparisons
count=10
if [ "$count" -eq 10 ]; then
    echo "count is equal to 10"
fi

if [ "$count" -ne 10 ]; then
    echo "count is not equal to 10"
else
    echo "count equals 10"
fi

## For loop (iterate list)
for item in "apple" "banana" "cherry"; do
    echo "Fruit: $item"
done

## Loop over array indices
for i in "${!transport[@]}"; do
    echo "transport[$i]=${transport[$i]}"
done

## C-style for loop
for ((i=0;i<3;i++)); do
    echo "C-style loop index: $i"
done

## While loop
counter=3
while [ $counter -gt 0 ]; do
    echo "Countdown: $counter"
    ((counter--))
done

## Until loop
u=0
until [ $u -ge 3 ]; do
    echo "Until loop: $u"
    ((u++))
done

## Case statement
read -p "Enter y/n: " yn
case "$yn" in
    [Yy]* ) echo "You answered yes" ;;
    [Nn]* ) echo "You answered no" ;;
    * ) echo "Please answer yes or no" ;;
esac

## Functions
greet() {
    local who=${1:-World}
    echo "Hello, $who"
}
greet "Alice"
greet

## Command substitution and arithmetic
now=$(date +%F_%T)
echo "Now: $now"
sum=$((5 + 7))
echo "5 + 7 = $sum"

## String operations
s="hello world"
echo "Length: ${#s}"
echo "Substring (0..4): ${s:0:5}"
echo "Replace: ${s/world/Bash}"

## Parameter expansion defaults
: ${UNSET_VAR:=default_value}
echo "UNSET_VAR is '$UNSET_VAR'"

## Here-doc (multiline string)
cat <<'EOF' > sample.txt
This is a sample file
created by a here-doc in a script
EOF
echo "Wrote sample.txt"

## Simple piping and redirection
ls -1 | grep -i "\.sh$" || true

## getopts example (simple flag parsing)
while getopts ":ab:" opt; do
  case $opt in
    a)
      echo "Flag -a set"
      ;;
    b)
      echo "Option -b with arg '$OPTARG'"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

## Trap example (cleanup)
trap 'echo "Script interrupted"; exit' INT TERM

## Exit status / set -e usage note
echo "Script completed"
