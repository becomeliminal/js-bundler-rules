#!/bin/sh
# Every case pattern in a build_defs command opens with "(".
#
# macOS's /bin/bash is 3.2. Inside $(...) it reads an unopened pattern's ")"
# as the end of the command substitution and fails the action with "syntax
# error near unexpected token `;;'" -- on every Mac, never on Linux, where
# bash is 5. Written "(pat)", the pattern parses in both.
set -u

# GIVEN the plugin's build definitions
files=$(find build_defs -name '*.build_defs')

# WHEN every case pattern in their code (comment lines blanked, numbering kept)
# is found: the word after "case X in", and the word after each ";;" that is
# not the closing esac
first=""
rest=""
for f in $files; do
    code=$(sed 's/^[[:space:]]*#.*$//' "$f")
    first="$first$(printf '%s\n' "$code" | grep -noE 'case[[:space:]]+[^[:space:]]+[[:space:]]+in[[:space:]]+[^[:space:]]+' |
        awk -v f="$f" '{ if (substr($NF, 1, 1) != "(") print f ":" $0 }')"
    rest="$rest$(printf '%s\n' "$code" | grep -noE ';;[[:space:]]*[^[:space:];]+' |
        awk -v f="$f" '{ w = $NF; sub(/^[0-9]+:;;/, "", w); if (w != "esac" && substr(w, 1, 1) != "(") print f ":" $0 }')"
done

# THEN none of them is unopened
if [ -n "$first$rest" ]; then
    echo "case patterns that macOS's bash 3.2 cannot parse inside \$(...); write (pattern):"
    [ -n "$first" ] && echo "$first"
    [ -n "$rest" ] && echo "$rest"
    exit 1
fi
echo "PASS: every case pattern in build_defs opens with ("
